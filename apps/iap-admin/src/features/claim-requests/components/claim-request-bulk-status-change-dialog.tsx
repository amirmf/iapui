import { useEffect, useMemo } from 'react'

import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests/constants/claim-request-status'
import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import {
  type ClaimRequestBulkStatusChangeForm,
  claimRequestBulkStatusChangeFormSchema,
} from '@features/claim-requests/model/claim-request-bulk-status-change-schema'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ClaimRequestStatus } from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextareaField,
} from '@iap/forms'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  SearchableSelect,
} from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type StatusOption = { label: string; value: ClaimRequestStatus }

const defaultValues: Partial<ClaimRequestBulkStatusChangeForm> = {
  claimRequestStatus: undefined,
  description: '',
  isCheat: 'N',
}

export function ClaimRequestBulkStatusChangeDialog(props: {
  claimRequestIds: string[]
  onSuccess: () => Promise<unknown> | void
}) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const schema = useMemo(() => claimRequestBulkStatusChangeFormSchema(t), [t])
  const form = useForm<ClaimRequestBulkStatusChangeForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const statusOptions = useMemo<StatusOption[]>(
    () =>
      Object.entries(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS).map(
        ([value, key]) => ({
          label: t(key as never),
          value: value as ClaimRequestStatus,
        })
      ),
    [t]
  )
  const mutation = useMutation({
    mutationFn: (values: ClaimRequestBulkStatusChangeForm) =>
      claimRequestService.submitObjectionsBulk({
        claimRequestId: claimRequestIds,
        claimRequestStatus: values.claimRequestStatus as ClaimRequestStatus,
        description: values.description?.trim() || undefined,
        isCheat: values.isCheat ?? 'N',
      }),
    onSuccess: (responses) => {
      toast.success(
        t('claimRequests.bulkStatusChange.success', { count: responses.length })
      )
      onSuccess()
      setOpenDialog(null)
      setRowSelection({})
    },
  })
  const isOpen = openDialog === 'bulkStatusChange'
  const isPending = mutation.isPending

  useEffect(() => {
    if (!isOpen) form.reset(defaultValues)
  }, [form, isOpen])

  const onSubmit = (values: ClaimRequestBulkStatusChangeForm) => {
    if (claimRequestIds.length === 0) {
      toast.error(t('claimRequests.bulkStatusChange.noSelection'))
      return
    }
    mutation.mutate(values)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpenDialog(open ? 'bulkStatusChange' : null)
      }}
      open={isOpen}
    >
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.bulkStatusChange.title')}</DialogTitle>
          <DialogDescription>
            {t('claimRequests.bulkStatusChange.description', {
              count: claimRequestIds.length,
            })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            id='claim-request-bulk-status-change-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='claimRequestStatus'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('claimRequests.dialog.fields.objectionStatus')}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      clearText={t('common.clear')}
                      emptyText={t('common.noResults')}
                      loadingText={t('common.loading')}
                      selectText={t('common.select')}
                      presentation='reference'
                      disabled={isPending}
                      onChange={field.onChange}
                      items={statusOptions}
                      placeholder={t(
                        'claimRequests.bulkStatusChange.statusPlaceholder'
                      )}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextareaField
              presentation='reference'
              control={form.control}
              disabled={isPending}
              label={t('claimRequests.dialog.fields.description')}
              name='description'
              placeholder={t(
                'claimRequests.bulkStatusChange.descriptionPlaceholder'
              )}
              rows={3}
            />
            <FormField
              control={form.control}
              name='isCheat'
              render={({ field }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Checkbox
                      aria-label={t('claimRequests.dialog.fields.isCheat')}
                      checked={field.value === 'Y'}
                      disabled={isPending}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 'Y' : 'N')
                      }
                    />
                  </FormControl>
                  <FormLabel className='cursor-pointer font-medium text-destructive'>
                    {t('claimRequests.dialog.fields.isCheat')}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2 sm:space-x-2'>
          <Button
            presentation='reference'
            disabled={isPending}
            onClick={() => setOpenDialog(null)}
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button
            presentation='reference'
            disabled={claimRequestIds.length === 0 || isPending}
            form='claim-request-bulk-status-change-form'
            type='submit'
          >
            {isPending
              ? t('claimRequests.bulkStatusChange.submitting')
              : t('claimRequests.bulkStatusChange.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
