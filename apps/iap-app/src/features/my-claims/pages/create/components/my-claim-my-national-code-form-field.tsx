import { useMemo } from 'react'

import type { MyClaimRequestForm } from '@features/my-claims/model/my-claim-request-form-schema'
import useGetMySubInsuredPeople from '@features/my-claims/queries/use-get-my-sub-insured-people'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { SearchableSelect } from '@iap/ui'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function MyClaimMyNationalCodeFormField({
  featureKey,
}: {
  featureKey?: string
}) {
  const { t } = useTranslation()
  const { control } = useFormContext<MyClaimRequestForm>()
  const id = useWatch({ control, name: 'extPolicyId' })
  const q = useGetMySubInsuredPeople({ policyId: id })
  const items = useMemo(
    () =>
      (q.data ?? []).map((p) => ({
        label: `${p.fullName ?? ''} (${p.nationalCode ?? ''}${p.isForeign === 'Y' ? `-${t('claimRequests.dialog.fields.foreign')}` : ''})`,
        value: String(p.nationalCode),
      })),
    [q.data, t]
  )
  return (
    <FormField
      control={control}
      name='extNationalCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('claimRequests.dialog.fields.subInsuredPerson')} *
            {featureKey && (
              <SupportFeatureButton
                featureKey={featureKey}
                variant='secondary'
                size='xs'
              />
            )}
          </FormLabel>
          <FormControl>
            <SearchableSelect
              presentation='reference'
              items={items}
              value={field.value?.nationalCode ?? undefined}
              onChange={(v) => {
                const p = q.data?.find((x) => x.nationalCode === v)
                if (p) field.onChange(p)
              }}
              placeholder={t(
                'claimRequests.dialog.fields.selectSubInsuredPerson'
              )}
              isLoading={q.isLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
