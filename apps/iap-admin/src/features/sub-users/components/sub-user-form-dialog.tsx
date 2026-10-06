import { useEffect, useMemo } from 'react'

import {
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
  Input,
  MultiSelect,
} from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types/queries/use-doc-types-data'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  DOCTOR_USER_ROLE,
  getSubUserRoleOptions,
} from '../constants/sub-user-constant'
import { useSubUser } from '../context/store/sub-user-store'
import {
  type CreateSubUserPayload,
  type UpdateSubUserPayload,
  createSubUserPayloadSchema,
  updateSubUserPayloadSchema,
} from '../model/sub-user-form-schema'
import { useUpsertSubUser } from '../queries/use-sub-user-mutations'
import { useSubUserByIdQuery } from '../queries/use-sub-users-query'

const defaultValues: CreateSubUserPayload = {
  branchLocations: null,
  docTypeCodes: [],
  email: '',
  hasAccessToAllBranch: null,
  mobileNumber: '',
  partyFname: '',
  partyLname: '',
  password: '',
  roles: [],
  username: '',
}

export function SubUserFormDialog() {
  const { t } = useTranslation()
  const open = useSubUser((state) => state.open)
  const setOpen = useSubUser((state) => state.setOpen)
  const currentRow = useSubUser((state) => state.currentRow)
  const setCurrentRow = useSubUser((state) => state.setCurrentRow)

  const isOpen = open === 'editor'
  const editorId = currentRow?.id
  const isEdit = Boolean(isOpen && editorId)

  const { options: docTypesData = [], isLoading: isLoadingDocTypes } =
    useDocTypesData.optionsCode({
      enabled: isOpen,
    })

  const { data: detailedSubUser, isLoading: isLoadingSubUser } =
    useSubUserByIdQuery(isOpen ? editorId : null)

  const roleOptions = useMemo(() => getSubUserRoleOptions(t), [t])

  const form = useForm<CreateSubUserPayload | UpdateSubUserPayload>({
    defaultValues,
    resolver: async (values) => {
      const schema = isEdit
        ? updateSubUserPayloadSchema(t)
        : createSubUserPayloadSchema(t)
      const result = schema.safeParse(values)
      if (result.success) {
        return { errors: {}, values: result.data }
      }
      const errors: Record<string, { message: string; type: string }> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (!errors[path]) {
          errors[path] = { message: issue.message, type: issue.code }
        }
      }
      return { errors, values: {} }
    },
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultValues)
      return
    }

    if (detailedSubUser) {
      form.reset({
        branchLocations: detailedSubUser.branchLocations ?? null,
        docTypeCodes: detailedSubUser.docTypeCodes ?? [],
        email: detailedSubUser.email ?? '',
        hasAccessToAllBranch: detailedSubUser.hasAccessToAllBranch ?? null,
        mobileNumber: detailedSubUser.mobileNumber ?? '',
        partyFname: detailedSubUser.party?.fname ?? '',
        partyLname: detailedSubUser.party?.lname ?? '',
        password: '',
        roles: (detailedSubUser.roles ?? []) as never,
        username: detailedSubUser.username,
      })
    } else if (currentRow && !isLoadingSubUser) {
      form.reset(defaultValues)
    }
  }, [isOpen, detailedSubUser, isLoadingSubUser, currentRow, form])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const upsertMutation = useUpsertSubUser({
    editorId,
    onSuccess: handleClose,
  })

  const onSubmit = (values: CreateSubUserPayload | UpdateSubUserPayload) => {
    upsertMutation.mutate(values)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose()
        }
      }}
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editorId
              ? t('subUsers.form.editTitle')
              : t('subUsers.form.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editorId
              ? t('subUsers.form.editDescription')
              : t('subUsers.form.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            autoComplete='off'
            className='grid gap-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-3 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.form.username')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.form.password')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='new-password'
                        type='password'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='partyFname'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.form.firstName')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='partyLname'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.form.lastName')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.columns.email')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='mobileNumber'
                render={({ field }) => (
                  <FormItem className='grid gap-1'>
                    <FormLabel>{t('subUsers.columns.mobileNumber')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
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
              render={({ field }) => {
                const currentRoles = (field.value ?? []) as string[]
                const selectedOptions = roleOptions.filter((opt) =>
                  currentRoles.includes(opt.value)
                )

                return (
                  <FormItem>
                    <FormLabel>{t('subUsers.form.roles')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        labelKey='label'
                        onValueChange={(selected) => {
                          const values = selected.map((s) => s.value)
                          const hasDoctor = values.includes(DOCTOR_USER_ROLE)
                          const hadDoctor =
                            currentRoles.includes(DOCTOR_USER_ROLE)
                          if (hasDoctor && !hadDoctor) {
                            field.onChange([DOCTOR_USER_ROLE])
                          } else if (hasDoctor && values.length > 1) {
                            field.onChange(
                              values.filter((v) => v !== DOCTOR_USER_ROLE)
                            )
                          } else {
                            field.onChange(values)
                          }
                        }}
                        options={roleOptions}
                        placeholder={t(
                          'parties.userAccount.placeholders.roles'
                        )}
                        value={selectedOptions}
                        valueKey='value'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name='docTypeCodes'
              render={({ field }) => {
                const currentCodes = (field.value ?? []) as string[]
                const selectedOptions = docTypesData.filter((opt) =>
                  currentCodes.includes(opt.value)
                )

                return (
                  <FormItem>
                    <FormLabel>{t('subUsers.form.docTypes')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        disabled={isLoadingDocTypes}
                        isLoading={isLoadingDocTypes}
                        labelKey='label'
                        onValueChange={(selected) => {
                          field.onChange(selected.map((s) => s.value))
                        }}
                        options={docTypesData}
                        placeholder={t('subUsers.form.docTypesPlaceholder')}
                        value={selectedOptions}
                        valueKey='value'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <DialogFooter>
              <Button onClick={handleClose} type='button' variant='outline'>
                {t('common.cancel')}
              </Button>
              <Button
                disabled={upsertMutation.isPending || isLoadingSubUser}
                type='submit'
              >
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
