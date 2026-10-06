import { useCallback, useEffect, useMemo } from 'react'

import { AgreementUserAccountSearchSelect } from '@features/agreements/components/agreement-party-appls/agreement-user-account-search-select'
import { getAgreementPartyApplCreateRoleOptions } from '@features/agreements/constants/agreement-party-role-options'
import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type AgreementPartyApplCreateForm,
  agreementPartyApplCreateFormSchema,
} from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const defaultValues: AgreementPartyApplCreateForm = {
  role: 'ASSESSMENT_USER',
  userAccountId: '',
}

export function AgreementPartyApplFormDialog(props: {
  agreementIdsCreate: string[]
}) {
  const { agreementIdsCreate } = props
  const { t } = useTranslate()
  const openDialog = useAgreementPartyApplStore((state) => state.openDialog)
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const queryClient = useQueryClient()
  const schema = useMemo(
    () => agreementPartyApplCreateFormSchema((key) => t(key as never)),
    [t]
  )
  const form = useForm<AgreementPartyApplCreateForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const roleOptions = useMemo(
    () => getAgreementPartyApplCreateRoleOptions(t),
    [t]
  )
  const resetAndClose = useCallback(() => {
    form.reset(defaultValues)
    setOpenDialog(null)
  }, [form, setOpenDialog])
  const mutation = useMutation({
    mutationFn: (values: AgreementPartyApplCreateForm) =>
      agreementPartyApplService.bulkCreatePartyApplicationsWithRole({
        agreementIds: agreementIdsCreate,
        docTypeCodes: [],
        role: values.role,
        userAccountIds: [values.userAccountId],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agreement-party-appls'],
      })
      toast.success(t('agreementPartyAppls.bulkAssign.success' as never))
      resetAndClose()
    },
  })
  const isOpen = openDialog === 'create'
  const close = () => {
    if (!mutation.isPending) resetAndClose()
  }
  useEffect(() => {
    if (isOpen) form.reset(defaultValues)
  }, [form, isOpen])

  return (
    <Dialog onOpenChange={(open) => !open && close()} open={isOpen}>
      <DialogContent
        presentation='reference'
        showCloseButton={!mutation.isPending}
      >
        <DialogHeader>
          <DialogTitle>
            {t('agreementPartyAppls.bulkAssign.title' as never)}
          </DialogTitle>
          <DialogDescription>
            {t('agreementPartyAppls.bulkAssign.description' as never)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((values) => {
              if (agreementIdsCreate.length > 0) mutation.mutate(values)
            })}
          >
            <FormField
              control={form.control}
              name='userAccountId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('agreements.partyAppls.user' as never)}
                  </FormLabel>
                  <FormControl>
                    <AgreementUserAccountSearchSelect
                      onChange={(value) => field.onChange(value ?? '')}
                      placeholder={t(
                        'agreements.partyAppls.selectUser' as never,
                        { defaultValue: t('common.select') }
                      )}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agreements.partyAppls.role')}</FormLabel>
                  <FormControl>
                    <Select
                      emptyText={t('common.noResults' as never)}
                      labelKey='label'
                      onValueChange={(option) => field.onChange(option?.value)}
                      options={roleOptions}
                      placeholder={t('common.select')}
                      searchPlaceholder=''
                      presentation='reference'
                      showSearch
                      value={roleOptions.find(
                        (option) => option.value === field.value
                      )}
                      valueKey='value'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className='flex-1'
                disabled={mutation.isPending}
                type='submit'
              >
                {t('agreementPartyAppls.bulkAssign.submit' as never)}
              </Button>
              <Button
                className='flex-1'
                disabled={mutation.isPending}
                onClick={close}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
