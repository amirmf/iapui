import { useEffect, useMemo } from 'react'

import type { InsuredPerson, PersonSpecialDiseasesEnum } from '@iap/api-types'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@iap/forms'
import { Button, MultiSelect } from '@iap/ui'
import {
  getSpecialDiseaseOptions,
  personSpecialDiseaseService,
} from '@modules/person-special-diseases'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormValues = { specialDiseases: PersonSpecialDiseasesEnum[] }

export function UserAccountSpecialDiseaseForm(props: {
  onBack: () => void
  onSuccess: () => void
  person: InsuredPerson
}) {
  const { onBack, onSuccess, person } = props
  const { t } = useTranslate()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({ defaultValues: { specialDiseases: [] } })
  const diseaseQuery = useQuery({
    enabled: Boolean(person.nationalCode),
    queryFn: ({ signal }) =>
      personSpecialDiseaseService.getByNationalCode(
        person.nationalCode!,
        signal
      ),
    queryKey: ['person-special-disease', person.nationalCode],
  })
  const options = useMemo(() => getSpecialDiseaseOptions(t), [t])
  useEffect(() => {
    form.setValue('specialDiseases', diseaseQuery.data?.specialDiseases ?? [])
  }, [diseaseQuery.data?.specialDiseases, form])
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        nationalCode: person.nationalCode ?? '',
        specialDiseases: values.specialDiseases,
      }
      return diseaseQuery.data?.id
        ? personSpecialDiseaseService.update(diseaseQuery.data.id, payload)
        : personSpecialDiseaseService.create(payload)
    },
    onSuccess: async () => {
      toast.success(t('parties.messages.updated'))
      await queryClient.invalidateQueries({
        queryKey: ['person-special-disease', person.nationalCode],
      })
      onSuccess()
    },
  })
  const personName = [person.name, person.lastName].filter(Boolean).join(' ')

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>{personName || '-'}</p>
        <p className='text-xs text-muted-foreground'>
          {person.nationalCode ?? '-'}
        </p>
      </div>
      <Form {...form}>
        <form
          className='space-y-4'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField
            control={form.control}
            name='specialDiseases'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('parties.userAccount.fields.specialDiseases')}
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    labelKey='label'
                    onValueChange={(items) =>
                      field.onChange(items.map((item) => item.value))
                    }
                    options={options}
                    placeholder={t(
                      'parties.userAccount.placeholders.specialDiseases'
                    )}
                    value={options.filter((item) =>
                      field.value.includes(item.value)
                    )}
                    valueKey='value'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            <Button onClick={onBack} type='button' variant='outline'>
              {t('common.back')}
            </Button>
            <Button
              disabled={mutation.isPending || diseaseQuery.isLoading}
              type='submit'
            >
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
