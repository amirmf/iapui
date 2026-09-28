import { useEffect, useMemo } from 'react'

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
  Select,
} from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { claimRequestStatusTranslationKeys } from '../constants/claim-request-status'
import {
  type ClaimRequestBulkStatusChangeForm,
  createClaimRequestBulkStatusChangeSchema,
} from '../model/claim-request-bulk-status-change-schema'
import { useClaimRequestStore } from '../model/store/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type StatusOption = { label: string; value: ClaimRequestStatus }

const defaultValues: ClaimRequestBulkStatusChangeForm = {
  claimRequestStatus: undefined,
  description: '',
  isCheat: 'N',
}

export function ClaimRequestBulkStatusChangeDialog(props: {
  claimRequestIds: string[]
  onSuccess: () => void
}) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const schema = useMemo(() => createClaimRequestBulkStatusChangeSchema(t), [t])
  const form = useForm<ClaimRequestBulkStatusChangeForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const statusOptions = useMemo<StatusOption[]>(
    () =>
      Object.entries(claimRequestStatusTranslationKeys).map(([value, key]) => ({
        label: t(key as never),
        value: value as ClaimRequestStatus,
      })),
    [t]
  )
  const mutation = useMutation({
    mutationFn: (values: ClaimRequestBulkStatusChangeForm) =>
      claimRequestService.submitBulkStatusChange({
        claimRequestId: claimRequestIds,
        claimRequestStatus: values.claimRequestStatus as ClaimRequestStatus,
        description: values.description?.trim() || undefined,
        isCheat: values.isCheat ?? 'N',
      }),
    onSuccess: (responses) => {
      toast.success(
        t('claimRequests.bulkStatusChange.success', { count: responses.length })
      )
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
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
    <Dialog onOpenChange={(open) => !open && setOpenDialog(null)} open={isOpen}>
      <DialogContent>
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
                    <Select
                      disabled={isPending}
                      labelKey='label'
                      onValueChange={(option) => field.onChange(option?.value)}
                      options={statusOptions}
                      placeholder={t(
                        'claimRequests.bulkStatusChange.statusPlaceholder'
                      )}
                      value={statusOptions.find(
                        (option) => option.value === field.value
                      )}
                      valueKey='value'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextareaField
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
                  <FormLabel className='cursor-pointer text-destructive'>
                    {t('claimRequests.dialog.fields.isCheat')}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() => setOpenDialog(null)}
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button
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
