import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { UpdateWithPartyPayload, UserAccount } from '@iap/api-types'
import { isAdminRole, useAuthSession } from '@iap/auth'
import { ConfirmDialog } from '@iap/dialogs'
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
import { Button, Checkbox, MultiSelect, Select } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { UserAccountSearchSelect } from '@modules/user-account-selection'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  getNationalityTypeOptions,
  getPartyRoleOptions,
} from '../constants/user-account-options'
import {
  type ParsedUpdateUserAccountFormValues,
  type UpdateUserAccountFormValues,
  updateUserAccountSchema,
} from '../model/user-account-form-schema'
import { userAccountService } from '../services/user-account-service'
import { BranchLocationsForm } from './branch-locations-form'
import { ResetPasswordDialog } from './reset-password-dialog'

function defaults(userAccount: UserAccount): UpdateUserAccountFormValues {
  return {
    accountNonExpired: userAccount.accountNonExpired ?? true,
    accountNonLocked: userAccount.accountNonLocked ?? true,
    branchLocations: userAccount.branchLocations ?? [],
    credentialsNonExpired: userAccount.credentialsNonExpired ?? true,
    docTypeCodes: userAccount.docTypeCodes ?? [],
    email: userAccount.email ?? '',
    enabled: userAccount.enabled ?? true,
    extContractId: userAccount.extContractId?.toString() ?? null,
    extId: userAccount.extId ?? '',
    fname: userAccount.fname ?? '',
    hasAccessToAllBranch: userAccount.hasAccessToAllBranch ?? null,
    lname: userAccount.lname ?? '',
    mobileNumber: userAccount.mobileNumber ?? '',
    nationalityType: userAccount.nationalityType ?? null,
    parentUserAccountId: userAccount.parentUserAccountId ?? '',
    password: undefined,
    roles: userAccount.roles ?? [],
    username: userAccount.username,
  }
}

function BooleanField(props: {
  control: ReturnType<typeof useForm<UpdateUserAccountFormValues>>['control']
  helper: string
  label: string
  name:
    | 'hasAccessToAllBranch'
    | 'enabled'
    | 'accountNonExpired'
    | 'credentialsNonExpired'
    | 'accountNonLocked'
}) {
  const { control, helper, label, name } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start gap-3 space-y-0 rounded-md border p-3'>
          <Checkbox
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
          />
          <div className='space-y-1 leading-none'>
            <FormLabel>{label}</FormLabel>
            <p className='text-xs text-muted-foreground'>{helper}</p>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function UpdateUserAccountForm(props: {
  onSuccess: () => void
  userAccount: UserAccount
}) {
  const { onSuccess, userAccount } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const canManagePrivileges =
    isAdminRole(user?.roles ?? []) ||
    (user?.roles ?? []).includes('ROLE_HQ_USER')
  const schema = useMemo(() => updateUserAccountSchema(t), [t])
  const form = useForm<UpdateUserAccountFormValues>({
    defaultValues: defaults(userAccount),
    resolver: zodResolver(schema),
  })
  const docTypesQuery = useQuery({
    queryFn: ({ signal }) =>
      docTypeService.getPage({ page: 0, signal, size: 100 }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })
  const roleOptions = useMemo(() => getPartyRoleOptions(t), [t])
  const nationalityOptions = useMemo(() => getNationalityTypeOptions(t), [t])
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

  useEffect(() => form.reset(defaults(userAccount)), [form, userAccount])

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateWithPartyPayload) =>
      userAccountService.updateWithParty(userAccount.id, payload),
    onSuccess: (data) => {
      toast.success(t('parties.userAccount.messages.updated'))
      queryClient.setQueryData(['party-user-account', userAccount.id], data)
      onSuccess()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => userAccountService.delete(userAccount.id),
    onSuccess: () => {
      toast.success(t('parties.userAccount.messages.deleted'))
      setDeleteDialogOpen(false)
      onSuccess()
    },
  })
  const submit = (rawValues: UpdateUserAccountFormValues) => {
    const values: ParsedUpdateUserAccountFormValues = schema.parse(rawValues)
    const payload: UpdateWithPartyPayload = {
      accountNonExpired: values.accountNonExpired,
      accountNonLocked: values.accountNonLocked,
      branchLocations: values.branchLocations ?? [],
      credentialsNonExpired: values.credentialsNonExpired,
      docTypeCodes: values.docTypeCodes ?? [],
      enabled: values.enabled,
      extContractId: values.extContractId ? Number(values.extContractId) : null,
      extId: values.extId?.trim() || null,
      fname: values.fname?.trim() || null,
      hasAccessToAllBranch: values.hasAccessToAllBranch ?? null,
      lname: values.lname?.trim() || null,
      mobileNumber: values.mobileNumber,
      nationalityType: values.nationalityType ?? undefined,
      parentUserAccountId: values.parentUserAccountId || null,
      roles: values.roles ?? [],
      username: values.username.trim(),
    }
    if (values.email) payload.email = values.email
    if (values.password) payload.password = values.password
    updateMutation.mutate(payload)
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
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
                    excludeUserAccountId={userAccount.id}
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
          <div className='grid items-start gap-4 sm:grid-cols-2'>
            <TextField
              control={form.control}
              label={t('parties.dialog.fields.extId')}
              name='extId'
            />
            <TextField
              control={form.control}
              inputMode='numeric'
              label={t('parties.userAccount.fields.extContractId')}
              name='extContractId'
            />
            <TextField
              autoComplete='username'
              control={form.control}
              label={t('parties.userAccount.fields.username')}
              name='username'
            />
            <TextField
              autoComplete='given-name'
              control={form.control}
              label={t('parties.dialog.fields.firstName')}
              name='fname'
            />
            <TextField
              autoComplete='family-name'
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
          {canManagePrivileges ? (
            <>
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
                          (field.value ?? []).includes(option.value)
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
                          (field.value ?? []).includes(option.value)
                        )}
                        valueKey='value'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <BranchLocationsForm />
            </>
          ) : null}
          <div>
            <TextField
              autoComplete='new-password'
              control={form.control}
              label={t('parties.userAccount.fields.passwordOptional')}
              name='password'
              type='password'
            />
            <FormDescription>
              <span className='font-medium'>
                {t('common.passwordRequirements.label')}
              </span>{' '}
              {t('common.passwordRequirements.description')}
            </FormDescription>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <BooleanField
              control={form.control}
              helper={t('parties.userAccount.helpers.hasAccessToAllBranch')}
              label={t('parties.userAccount.fields.hasAccessToAllBranch')}
              name='hasAccessToAllBranch'
            />
            <BooleanField
              control={form.control}
              helper={t('parties.userAccount.helpers.enabled')}
              label={t('parties.userAccount.fields.enabled')}
              name='enabled'
            />
            <BooleanField
              control={form.control}
              helper={t('parties.userAccount.helpers.accountNonExpired')}
              label={t('parties.userAccount.fields.accountNonExpired')}
              name='accountNonExpired'
            />
            <BooleanField
              control={form.control}
              helper={t('parties.userAccount.helpers.credentialsNonExpired')}
              label={t('parties.userAccount.fields.credentialsNonExpired')}
              name='credentialsNonExpired'
            />
            <BooleanField
              control={form.control}
              helper={t('parties.userAccount.helpers.accountNonLocked')}
              label={t('parties.userAccount.fields.accountNonLocked')}
              name='accountNonLocked'
            />
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Button
                onClick={() => setResetDialogOpen(true)}
                type='button'
                variant='outline'
              >
                {t('parties.userAccount.buttons.resetPassword')}
              </Button>
              {isAdminRole(user?.roles ?? []) ? (
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  type='button'
                  variant='destructive'
                >
                  {t('parties.userAccount.buttons.delete')}
                </Button>
              ) : null}
            </div>
            <Button disabled={updateMutation.isPending} type='submit'>
              {updateMutation.isPending
                ? t('parties.userAccount.buttons.saving')
                : t('parties.userAccount.buttons.save')}
            </Button>
          </div>
        </form>
      </Form>
      <ConfirmDialog
        confirmLabel={t('parties.userAccount.delete.confirm')}
        description={t('parties.userAccount.delete.description')}
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onOpenChange={(open) =>
          !deleteMutation.isPending && setDeleteDialogOpen(open)
        }
        open={deleteDialogOpen}
        title={t('parties.userAccount.delete.title')}
        variant='error'
      />
      <ResetPasswordDialog
        onOpenChange={setResetDialogOpen}
        open={resetDialogOpen}
        userAccountId={userAccount.id}
      />
    </>
  )
}
