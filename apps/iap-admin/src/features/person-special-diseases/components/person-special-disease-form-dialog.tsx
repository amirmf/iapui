import { useCallback, useEffect, useMemo } from 'react'

import { PersonSpecialDiseaseUserSearchSelect } from '@features/person-special-diseases/components/person-special-disease-user-search-select'
import {
  type PersonSpecialDiseaseFormValues,
  createPersonSpecialDiseaseFormSchema,
} from '@features/person-special-diseases/model/person-special-disease-form-schema'
import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/model/store/person-special-disease-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { type PersonSpecialDisease } from '@iap/api-types'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  MultiSelect,
} from '@iap/ui'
import {
  getSpecialDiseaseOptions,
  personSpecialDiseaseService,
} from '@modules/person-special-diseases'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type PersonSpecialDiseaseFormDialogProps = {
  refetch?: () => Promise<unknown> | void
}

const defaultValues: PersonSpecialDiseaseFormValues = {
  nationalCode: '',
  specialDiseases: [],
}

export function PersonSpecialDiseaseFormDialog(
  props: PersonSpecialDiseaseFormDialogProps
) {
  const { refetch } = props
  const { t } = useTranslation()
  const currentRow = usePersonSpecialDiseaseStore((state) => state.currentRow)
  const openDialog = usePersonSpecialDiseaseStore((state) => state.openDialog)
  const setCurrentRow = usePersonSpecialDiseaseStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = usePersonSpecialDiseaseStore(
    (state) => state.setOpenDialog
  )
  const isEdit = Boolean(currentRow?.id)
  const isOpen = openDialog === 'create' || openDialog === 'edit'
  const schema = useMemo(() => createPersonSpecialDiseaseFormSchema(t), [t])
  const options = useMemo(() => getSpecialDiseaseOptions(t), [t])
  const form = useForm<PersonSpecialDiseaseFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const createMutation = useMutation({
    mutationFn: personSpecialDiseaseService.create,
  })
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: PersonSpecialDisease
    }) => personSpecialDiseaseService.update(id, payload),
  })
  const close = useCallback(() => {
    setOpenDialog(null)
    setCurrentRow(null)
  }, [setCurrentRow, setOpenDialog])

  useEffect(() => {
    if (!isOpen) return

    form.reset({
      nationalCode: currentRow?.nationalCode ?? '',
      specialDiseases: currentRow?.specialDiseases ?? [],
    })
  }, [currentRow, form, isOpen])

  const submit = async (values: PersonSpecialDiseaseFormValues) => {
    const payload: PersonSpecialDisease = values
    if (isEdit && currentRow?.id) {
      await updateMutation.mutateAsync({ id: currentRow.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    close()
    await refetch?.()
  }

  return (
    <Dialog onOpenChange={(open) => !open && close()} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('personSpecialDiseases.dialog.editTitle')
              : t('personSpecialDiseases.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name='nationalCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personSpecialDiseases.dialog.fields.nationalCode')}
                  </FormLabel>
                  <FormControl>
                    <PersonSpecialDiseaseUserSearchSelect
                      onChange={(value) => field.onChange(value ?? '')}
                      placeholder={t(
                        'personSpecialDiseases.dialog.fields.nationalCode'
                      )}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='specialDiseases'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personSpecialDiseases.dialog.fields.specialDiseases')}
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      labelKey='label'
                      onValueChange={(items) =>
                        field.onChange(items.map((item) => item.value))
                      }
                      options={options}
                      placeholder={t(
                        'personSpecialDiseases.dialog.fields.specialDiseases'
                      )}
                      value={options.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      valueKey='value'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button onClick={close} type='button' variant='outline'>
                {t('common.cancel')}
              </Button>
              <Button type='submit'>
                {t('personSpecialDiseases.actions.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
