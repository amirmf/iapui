import { useEffect, useState } from 'react'

import MyClaimMyInsurancePolicyFormField from '@features/my-claims/components/my-claim-my-insurance-policy-form-field'
import MyClaimMyNationalCodeFormField from '@features/my-claims/components/my-claim-my-national-code-form-field'
import { MyClaimRequestsDateFilters } from '@features/my-claims/components/my-claim-requests-date-filters'
import { MyClaimRequestsStatusFilter } from '@features/my-claims/components/my-claim-requests-status-filter'
import {
  type MyClaimRequestsFilterFormValues,
  type MyClaimRequestsFilterValues,
  toApiFilters,
  toFilterFormValues,
} from '@features/my-claims/model/filter-values'
import { Form } from '@iap/forms'
import { Button, cn } from '@iap/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@iap/ui'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type { MyClaimRequestsFilterValues } from '@features/my-claims/model/filter-values'

const EMPTY_FILTERS: MyClaimRequestsFilterValues = {}

interface MyClaimRequestsFilterProps {
  onFilterChange: (filters: MyClaimRequestsFilterValues) => void
  initialFilters?: MyClaimRequestsFilterValues
}

export function MyClaimRequestsFilter(props: MyClaimRequestsFilterProps) {
  const { onFilterChange, initialFilters = EMPTY_FILTERS } = props
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<MyClaimRequestsFilterFormValues>({
    defaultValues: toFilterFormValues(initialFilters),
  })

  useEffect(() => {
    form.reset(toFilterFormValues(initialFilters))
  }, [form, initialFilters])

  const statusFilter = useWatch({ control: form.control, name: 'status' }) || []
  const extNationalCode = useWatch({
    control: form.control,
    name: 'extNationalCode',
  })
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

  const activeFilterCount =
    (statusFilter?.length || 0) +
    (extNationalCode ? 1 : 0) +
    (submitDateFrom ? 1 : 0) +
    (submitDateTo ? 1 : 0) +
    (createdAtFrom ? 1 : 0) +
    (createdAtTo ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const handleApply = form.handleSubmit((values) => {
    const normalizedValues = { ...values }
    delete normalizedValues.extPolicyId
    onFilterChange(toApiFilters(normalizedValues))
  })

  const handleClear = () => {
    const extPolicyId = form.getValues().extPolicyId
    const clearedValues = {
      extPolicyId,
    }
    form.reset(clearedValues)
    onFilterChange({})
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className='rounded-lg border bg-card'>
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='flex w-full cursor-pointer items-center justify-between p-4'
          >
            <div className='flex items-center gap-2'>
              <h3 className='text-sm font-medium'>
                {t('myClaimRequests.filters.title', 'Filters')}
              </h3>
              {hasActiveFilters && (
                <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground'>
                  {activeFilterCount}
                </span>
              )}
            </div>
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Form {...form}>
            <form onSubmit={handleApply} className='space-y-4 border-t p-4'>
              <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
                <MyClaimMyInsurancePolicyFormField
                  label={t(
                    'myClaimRequests.filters.policyLabel',
                    'Insurance policy'
                  )}
                  placeholder={t(
                    'myClaimRequests.filters.policyPlaceholder',
                    'Select insurance policy'
                  )}
                  isRequired={false}
                  isFilter
                />
                <MyClaimMyNationalCodeFormField
                  label={t(
                    'myClaimRequests.filters.subInsuredLabel',
                    'Sub-insured person'
                  )}
                  placeholder={t(
                    'myClaimRequests.filters.subInsuredPlaceholder',
                    'Select sub-insured person'
                  )}
                  isRequired={false}
                  isFilter
                />

                <MyClaimRequestsStatusFilter />
                <MyClaimRequestsDateFilters />
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                {hasActiveFilters && (
                  <Button
                    presentation='reference'
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleClear}
                    className='gap-1.5'
                  >
                    <XIcon className='h-3.5 w-3.5' />
                    {t('myClaimRequests.filters.clear')}
                  </Button>
                )}
                <Button
                  presentation='reference'
                  type='submit'
                  size='sm'
                  className='gap-1.5'
                >
                  {t('myClaimRequests.filters.apply')}
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
