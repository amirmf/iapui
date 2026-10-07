import { useEffect, useMemo, useState } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { MultiSelect } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { type SupportQuestionForm } from '../../model'
import { supportQuestionService } from '../../services'

function useDebouncedTextSearch(delay = 500) {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(input)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [input, delay])

  return {
    input,
    search,
    setSearch: setInput,
  }
}

export function SupportQuestionNextSelectableQuestionKeysField() {
  const { t } = useTranslation()
  const { control } = useFormContext<SupportQuestionForm>()
  const { search, setSearch } = useDebouncedTextSearch()

  const currentQuestionKey = useWatch({
    control,
    name: 'questionKey',
  })

  const { data: supportQuestions, isFetching } = useQuery({
    queryKey: ['support-question-options', search],
    queryFn: ({ signal }) =>
      supportQuestionService.getPageFull({
        page: 0,
        size: 20,
        filters: {
          title__like: search || undefined,
        },
        signal,
      }),
    staleTime: 30 * 1000,
    gcTime: 30 * 1000,
  })

  const supportQuestionItems = useMemo(() => {
    const tmp: { label: string; value: string }[] = []
    supportQuestions?.content?.forEach((question) => {
      const questionKey = question.questionKey
      if (questionKey && questionKey !== currentQuestionKey) {
        tmp.push({
          label: questionKey,
          value: questionKey,
        })
      }
    })
    return tmp
  }, [currentQuestionKey, supportQuestions?.content])

  return (
    <FormField
      control={control}
      name='nextSelectableQuestionKeys'
      render={({ field }) => {
        const value = field.value ?? []

        return (
          <FormItem>
            <FormLabel>
              {t('supportQuestions.fields.nextSelectableQuestionKeys')}
            </FormLabel>
            <FormControl>
              <MultiSelect
                labelKey='label'
                valueKey='value'
                options={supportQuestionItems}
                value={value}
                onValueChange={(selected) => {
                  field.onChange(
                    selected.map((item) => ({
                      label: item.value,
                      value: item.value,
                    }))
                  )
                }}
                isLoading={isFetching}
                onSearch={setSearch}
                placeholder={t(
                  'supportQuestions.fields.nextSelectableQuestionKeys'
                )}
                shouldFilter={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
