import { useMemo } from 'react'

import type { MyClaimRequestsFilterFormValues } from '@features/my-claims/model/filter-values'
import { FormControl, FormField, FormItem, FormLabel } from '@iap/forms'
import { DateRangePicker } from '@iap/ui'
import { format, parseISO } from 'date-fns'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const parseDateFilterValue = (value: unknown): Date | undefined => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined
  }

  try {
    return parseISO(value)
  } catch {
    return undefined
  }
}

export function MyClaimRequestsDateFilters() {
  const form = useFormContext<MyClaimRequestsFilterFormValues>()
  const { t, i18n } = useTranslation()
  const submitDateFrom = useWatch({
    control: form.control,
    name: 'submitDate__from',
  })
  const submitDateTo = useWatch({
    control: form.control,
    name: 'submitDate__to',
  })
  const createdAtFrom = useWatch({
    control: form.control,
    name: 'createdAt__from',
  })
  const createdAtTo = useWatch({
    control: form.control,
    name: 'createdAt__to',
  })
  const submitDateRange = useMemo(
    () => ({
      from: parseDateFilterValue(submitDateFrom),
      to: parseDateFilterValue(submitDateTo),
    }),
    [submitDateFrom, submitDateTo]
  )

  const createdAtRange = useMemo(
    () => ({
      from: parseDateFilterValue(createdAtFrom),
      to: parseDateFilterValue(createdAtTo),
    }),
    [createdAtFrom, createdAtTo]
  )

  return (
    <>
      <FormField
        control={form.control}
        name='submitDate__from'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-sm font-medium'>
              {t('myClaimRequests.filters.submitDate')}
            </FormLabel>
            <FormControl>
              <DateRangePicker
                presentation='reference'
                locale={i18n.language.startsWith('fa') ? 'fa' : 'en'}
                clearLabel={t('common.clear')}
                value={submitDateRange}
                onChange={(range) => {
                  field.onChange(
                    range.from ? format(range.from, 'yyyy-MM-dd') : undefined
                  )
                  form.setValue(
                    'submitDate__to',
                    range.to ? format(range.to, 'yyyy-MM-dd') : undefined
                  )
                }}
                fromPlaceholder={t('claimRequests.filters.submitDateFrom')}
                toPlaceholder={t('claimRequests.filters.submitDateTo')}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='createdAt__from'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-sm font-medium'>
              {t('myiap.claimRequest.detail.createdAt')}
            </FormLabel>
            <FormControl>
              <DateRangePicker
                presentation='reference'
                locale={i18n.language.startsWith('fa') ? 'fa' : 'en'}
                clearLabel={t('common.clear')}
                value={createdAtRange}
                onChange={(range) => {
                  field.onChange(
                    range.from ? format(range.from, 'yyyy-MM-dd') : undefined
                  )
                  form.setValue(
                    'createdAt__to',
                    range.to ? format(range.to, 'yyyy-MM-dd') : undefined
                  )
                }}
                fromPlaceholder={t('claimRequests.filters.createdAtFrom')}
                toPlaceholder={t('claimRequests.filters.createdAtTo')}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}
