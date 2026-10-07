import { useEffect } from 'react'

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
  Input,
  MultiSelect,
} from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types/queries/use-doc-types-data'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DOCTOR_USER_ROLE } from '../constants/sub-user-constant'
import { useSubUser } from '../context/sub-user-context'
import {
  type CreateSubUserPayloadType,
  type UpdateSubUserPayloadType,
  createSubUserPayloadSchema,
  updateSubUserPayloadSchema,
} from '../model/sub-user-form-schema'
import { subUserService } from '../services/sub-user-service'
import { typedZodResolver } from './typed-zod-resolver'

const defaultValues: CreateSubUserPayloadType = {
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
  const queryClient = useQueryClient()
  const open = useSubUser((state) => state.open)
  const setOpen = useSubUser((state) => state.setOpen)
  const currentRow = useSubUser((state) => state.currentRow)
  const isOpen = open === 'editor'
  const editorId = currentRow?.id
  const isEdit = Boolean(isOpen && editorId)

  const { options: docTypesData = [], isLoading: isLoadingDocTypes } =
    useDocTypesData.optionsCode({
      enabled: isOpen,
    })

  const {
    data: detailedSubUser,
    isLoading: isLoadingSubUser,
    refetch,
  } = useQuery({
    enabled: !!editorId,
    queryFn: () => subUserService.getById(editorId!),
    queryKey: ['sub-user', editorId],
  })

  const form = useForm<CreateSubUserPayloadType>({
    defaultValues,
    resolver: typedZodResolver(
      isEdit ? updateSubUserPayloadSchema(t) : createSubUserPayloadSchema(t)
    ),
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultValues)
    }
  }, [form, isOpen])

  useEffect(() => {
    if (open !== 'editor') {
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
      return
    }

    if (currentRow && !isLoadingSubUser) {
      form.reset(defaultValues)
    }
  }, [open, detailedSubUser, isLoadingSubUser, currentRow, form])

  const upsertMutation = useMutation({
    mutationFn: async (
      payload: CreateSubUserPayloadType | UpdateSubUserPayloadType
    ) => {
      const finalData: CreateSubUserPayloadType | UpdateSubUserPayloadType = {
        branchLocations: payload.branchLocations ?? null,
        docTypeCodes: payload.docTypeCodes,
        email: null,
        hasAccessToAllBranch: payload.hasAccessToAllBranch ?? null,
        mobileNumber: payload.mobileNumber,
        partyFname: payload.partyFname,
        partyLname: payload.partyLname,
        roles: payload.roles,
        username: payload.username,
      }
      if (payload.password) {
        finalData.password = payload.password
      }
      if (payload.email) {
        finalData.email = payload.email
      }
      if (currentRow?.id) {
        return subUserService.update(currentRow.id, finalData)
      }

      return subUserService.create(finalData as CreateSubUserPayloadType)
    },
    onSuccess: () => {
      toast.success(t('subUsers.messages.saveSuccess'))
      setOpen(null)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['sub-users'] })
    },
  })

  const onSubmit = (
    values: CreateSubUserPayloadType | UpdateSubUserPayloadType
  ) => {
    upsertMutation.mutate(values)
  }

  const roleOptions = [
    {
      label: t('parties.role.requestRegisteryAgent'),
      value: 'ROLE_REQUEST_REGISTERY_AGENT',
    },
    {
      label: t('parties.role.assessmentUser'),
      value: 'ROLE_ASSESSMENT_USER',
    },
    {
      label: t('parties.role.doctorUser'),
      value: DOCTOR_USER_ROLE,
    },
  ]

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOpen(null)
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

        <Form {...form}>
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
                          field.onChange(
                            values.includes(DOCTOR_USER_ROLE)
                              ? [DOCTOR_USER_ROLE]
                              : values
                          )
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
              <Button
                onClick={() => setOpen(null)}
                type='button'
                variant='outline'
              >
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
