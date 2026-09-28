import { useEffect, useMemo } from 'react'

import {
  getNationalityTypeOptions,
  getPartyRoleOptions,
} from '@features/user-account/constants/user-account-options'
import {
  type PartyUserAccountDialogForm,
  createPartyUserAccountDialogSchema,
} from '@features/user-account/model/user-account-form-schema'
import { useUserAccountStore } from '@features/user-account/model/user-account-store'
import { userAccountService } from '@features/user-account/services/user-account-service'
import { BranchLocationsForm } from '@features/user-account/ui/branch-locations-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RegisterWithPartyPayload } from '@iap/api-types'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextField,
} from '@iap/forms'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  MultiSelect,
  Select,
} from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { UserAccountSearchSelect } from '@modules/user-account-selection'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const defaultValues: PartyUserAccountDialogForm = {
  branchLocations: [],
  confirmPassword: '',
  docTypeCodes: [],
  email: '',
  extId: '',
  fname: '',
  hasAccessToAllBranch: null,
  lname: '',
  mobileNumber: '',
  nationalityType: null,
  parentUserAccountId: '',
  password: '',
  roles: ['ROLE_PUBLIC_USER'],
  username: '',
}

export function PartyFormDialog(props: { onSuccess: () => void }) {
  const { onSuccess } = props
  const { t } = useTranslate()
  const closeDialog = useUserAccountStore((state) => state.closeDialog)
  const dialog = useUserAccountStore((state) => state.dialog)
  const isOpen = dialog === 'create'
  const schema = useMemo(() => createPartyUserAccountDialogSchema(t), [t])
  const form = useForm<PartyUserAccountDialogForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const docTypesQuery = useQuery({
    queryFn: ({ signal }) =>
      docTypeService.getPage({ page: 0, signal, size: 100 }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })
  const docTypeOptions = useMemo(
    () =>
      (docTypesQuery.data?.content ?? [])
        .filter(
          (item): item is typeof item & { docTypeCode: string } =>
            typeof item.docTypeCode === 'string'
        )
        .map((item) => ({
          label: item.docType ?? item.docTypeCode,
          value: item.docTypeCode,
        })),
    [docTypesQuery.data?.content]
  )
  const roleOptions = useMemo(() => getPartyRoleOptions(t), [t])
  const nationalityOptions = useMemo(() => getNationalityTypeOptions(t), [t])
  const mutation = useMutation({
    mutationFn: (payload: RegisterWithPartyPayload) =>
      userAccountService.createWithParty(payload),
    onSuccess: () => {
      toast.success(t('parties.messages.created'))
      form.reset(defaultValues)
      closeDialog()
      onSuccess()
    },
  })

  useEffect(() => {
    if (isOpen) form.reset(defaultValues)
  }, [form, isOpen])

  const submit = (values: PartyUserAccountDialogForm) => {
    mutation.mutate({
      branchLocations: values.branchLocations ?? [],
      docTypeCodes: values.docTypeCodes,
      email: values.email || null,
      extId: values.extId || null,
      fname: values.fname,
      hasAccessToAllBranch: values.hasAccessToAllBranch ?? null,
      lname: values.lname,
      mobileNumber: values.mobileNumber || null,
      nationalityType: values.nationalityType ?? undefined,
      parentUserAccountId: values.parentUserAccountId || null,
      password: values.password,
      roles: values.roles,
      username: values.username.trim(),
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !mutation.isPending && closeDialog()}
    >
      <DialogContent className='px-2 py-4 sm:max-w-2xl md:p-6 md:px-3'>
        <DialogHeader className='px-3 text-start'>
          <DialogTitle>{t('parties.dialog.create')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className='max-h-[60vh] flex-1 space-y-4 overflow-y-auto px-3'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <TextField
                  control={form.control}
                  label={t('parties.dialog.fields.extId')}
                  name='extId'
                />
                <TextField
                  autoComplete='username'
                  control={form.control}
                  label={t('parties.userAccount.fields.username')}
                  name='username'
                />
                <TextField
                  control={form.control}
                  label={t('parties.dialog.fields.firstName')}
                  name='fname'
                />
                <TextField
                  control={form.control}
                  label={t('parties.dialog.fields.lastName')}
                  name='lname'
                />
                <TextField
                  autoComplete='tel'
                  control={form.control}
                  inputMode='tel'
                  label={t('parties.userAccount.fields.mobileNumber')}
                  name='mobileNumber'
                />
                <TextField
                  autoComplete='email'
                  control={form.control}
                  label={t('parties.userAccount.fields.email')}
                  name='email'
                  type='email'
                />
                <FormField
                  control={form.control}
                  name='nationalityType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('parties.userAccount.fields.nationalityType')}
                      </FormLabel>
                      <FormControl>
                        <Select
                          labelKey='label'
                          onValueChange={(option) =>
                            field.onChange(option?.value ?? null)
                          }
                          options={nationalityOptions}
                          placeholder={t(
                            'parties.userAccount.placeholders.nationalityType'
                          )}
                          value={nationalityOptions.find(
                            (option) => option.value === field.value
                          )}
                          valueKey='value'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='roles'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('parties.userAccount.fields.roles')}
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        labelKey='label'
                        onValueChange={(options) =>
                          field.onChange(options.map((option) => option.value))
                        }
                        options={roleOptions}
                        placeholder={t(
                          'parties.userAccount.placeholders.roles'
                        )}
                        value={roleOptions.filter((option) =>
                          field.value.includes(option.value)
                        )}
                        valueKey='value'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='docTypeCodes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('parties.userAccount.fields.docTypeCodes')}
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        disabled={docTypesQuery.isLoading}
                        labelKey='label'
                        onValueChange={(options) =>
                          field.onChange(options.map((option) => option.value))
                        }
                        options={docTypeOptions}
                        placeholder={t(
                          'parties.userAccount.placeholders.docTypeCodes'
                        )}
                        value={docTypeOptions.filter((option) =>
                          field.value.includes(option.value)
                        )}
                        valueKey='value'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentUserAccountId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('parties.userAccount.fields.parentUserAccount')}
                    </FormLabel>
                    <FormControl>
                      <UserAccountSearchSelect
                        onChange={(value) => field.onChange(value ?? '')}
                        placeholder={t(
                          'parties.userAccount.placeholders.parentUserAccount'
                        )}
                        roles='ROLE_MAIN_ASSESSMENT_USER'
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <BranchLocationsForm isOpen={isOpen} />
              <FormField
                control={form.control}
                name='hasAccessToAllBranch'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start gap-3 space-y-0 rounded-md border p-3'>
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
                      }
                    />
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        {t('parties.userAccount.fields.hasAccessToAllBranch')}
                      </FormLabel>
                      <p className='text-xs text-muted-foreground'>
                        {t('parties.userAccount.helpers.hasAccessToAllBranch')}
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <TextField
                  autoComplete='new-password'
                  control={form.control}
                  label={t('parties.userAccount.fields.password')}
                  name='password'
                  type='password'
                />
                <TextField
                  autoComplete='new-password'
                  control={form.control}
                  label={t('parties.userAccount.fields.confirmPassword')}
                  name='confirmPassword'
                  type='password'
                />
              </div>
              <FormDescription>
                <span className='font-medium'>
                  {t('common.passwordRequirements.label')}
                </span>{' '}
                {t('common.passwordRequirements.description')}
              </FormDescription>
            </div>
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                disabled={mutation.isPending}
                onClick={() => !mutation.isPending && closeDialog()}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={mutation.isPending} type='submit'>
                {mutation.isPending ? t('form.creating') : t('form.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
