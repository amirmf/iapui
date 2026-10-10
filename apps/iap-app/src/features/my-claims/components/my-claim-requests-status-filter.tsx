import { MultiSelect } from '@features/my-claims/components/my-claim-request-status-select'
import {
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  type MyIapClaimRequestStatusFilterValue,
  getClaimRequestStatusOptionsIAP,
} from '@features/my-claims/constants/claim-status-constant'
import type { MyClaimRequestsFilterFormValues } from '@features/my-claims/model/filter-values'
import { FormControl, FormField, FormItem, FormLabel } from '@iap/forms'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestsStatusFilter() {
  const form = useFormContext<MyClaimRequestsFilterFormValues>()
  const { t } = useTranslation()
  return (
    <FormField
      control={form.control}
      name='status'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium'>
            {t('myClaimRequests.filters.status')}
          </FormLabel>
          <FormControl>
            <MultiSelect
              aria-label={t('myClaimRequests.filters.status')}
              value={field.value || []}
              onChange={(statuses) => {
                const tmpStatuses =
                  statuses as MyIapClaimRequestStatusFilterValue[]
                let finalStatues:
                  MyIapClaimRequestStatusFilterValue[] | undefined = undefined
                const wasSelectedPaid = field?.value?.includes('PAID')
                const wasSelectedSentToBank = field?.value?.includes(
                  MY_IAP_SENT_TO_BANK_FILTER_VALUE
                )
                if (tmpStatuses.length) {
                  if (tmpStatuses.includes('PAID')) {
                    if (wasSelectedPaid) {
                      finalStatues = tmpStatuses.filter(
                        (item) => item !== 'PAID'
                      )
                    } else {
                      finalStatues = ['PAID']
                    }
                  } else if (
                    tmpStatuses.includes(MY_IAP_SENT_TO_BANK_FILTER_VALUE)
                  ) {
                    if (wasSelectedSentToBank) {
                      finalStatues = tmpStatuses.filter(
                        (item) => item !== MY_IAP_SENT_TO_BANK_FILTER_VALUE
                      )
                    } else {
                      finalStatues = [MY_IAP_SENT_TO_BANK_FILTER_VALUE]
                    }
                  } else {
                    finalStatues = [...tmpStatuses]
                  }
                }
                field.onChange(finalStatues)
              }}
              items={getClaimRequestStatusOptionsIAP(t)}
              placeholder={t('myClaimRequests.filters.selectStatus')}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
