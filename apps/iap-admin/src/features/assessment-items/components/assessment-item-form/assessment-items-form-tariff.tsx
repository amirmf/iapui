import { useEffect, useMemo } from 'react'

import { ASSESSMENT_ITEMS_TARIFF_TRANSLATE_KEY } from '@features/assessment-items/constants/assessment-items-constant'
import {
  type AssessmentItemFormType,
  type TariffEnumType,
} from '@features/assessment-items/model/assessment-item-form-contract'
import { damageCodeService } from '@features/damage-codes'
import { type ClaimRequest } from '@iap/api-types'
import { type DamageCode } from '@iap/api-types'
import { FormField, FormItem } from '@iap/forms'
import { cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { formatDate } from '@shared/lib/format-date'
import { useMutation } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

const tariffGeneral: TariffEnumType[] = [
  'PRIVATE_SECTOR_TARIFF',
  'PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE',
  // 'GOVERNMENT_SECTOR_TARIFF',
  // 'PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF',
  // 'CHARITY_SECTOR_TARIFF',
]

const tariffTooth: TariffEnumType[] = [
  'TEETH_GENERAL_DOCTOR',
  'TEETH_SPECIAL_DOCTOR',
]

interface AssessmentItemsFormTariff {
  tariffAmountItemRemain: string
  isEdit: boolean
  claimRequestData?: ClaimRequest
}

export function AssessmentItemsFormTariff(props: AssessmentItemsFormTariff) {
  const { tariffAmountItemRemain, isEdit, claimRequestData } = props
  const { t } = useTranslate()
  const { control, setValue, setError } =
    useFormContext<AssessmentItemFormType>()

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const tariff = useWatch<AssessmentItemFormType>({
    control,
    name: 'tariff',
  }) as TariffEnumType | null

  const finalTariff = damageCode.isDentalService ? tariffTooth : tariffGeneral

  const jalaliSubmitYear = useMemo(() => {
    const date = formatDate(claimRequestData?.submitDate)
    return date.split('/')[0]
  }, [claimRequestData?.submitDate])

  const damageCodeId = damageCode?.id ?? null
  const policyId = claimRequestData?.extPolicyId ?? undefined

  const { mutate: damageCodePriceMutate, isPending } = useMutation({
    mutationFn: ({
      priceType,
      damageCodeId,
    }: {
      priceType: TariffEnumType
      damageCodeId: string
    }) =>
      damageCodeService.getPrice({
        damageCodeId,
        priceType,
        year: Number(jalaliSubmitYear),
        policyId,
      }),
    onSuccess: (data) => {
      const priceAmount = data?.pricingList?.[0]?.amount
      const overrideRatio = priceAmount != null ? (data.overrideRatio ?? 1) : 1
      const priceAmountFinal =
        priceAmount && priceAmount > 1 ? priceAmount * overrideRatio : 0

      const amountItem =
        priceAmountFinal &&
        priceAmountFinal < Number(tariffAmountItemRemain || 0)
          ? priceAmountFinal
          : Number(tariffAmountItemRemain || 0)

      setValue('amountItem', amountItem ? String(Math.ceil(amountItem)) : '')
      setValue('overrideRatio', overrideRatio)
    },
  })

  useEffect(() => {
    if (damageCodeId && tariff) {
      damageCodePriceMutate({ priceType: tariff, damageCodeId })
    }
  }, [damageCodeId, damageCodePriceMutate, isEdit, tariff])

  return (
    <FormField
      control={control}
      name='tariff'
      render={({ field }) => {
        return (
          <FormItem className='flex flex-wrap gap-2'>
            {finalTariff.map((item: TariffEnumType) => (
              <button
                key={item}
                type='button'
                className={cn(
                  'rounded-md border border-border px-1.5 py-0.5 text-xs font-medium transition-colors',
                  field.value === item &&
                    'border-primary-200 bg-primary-100/30 text-primary-700'
                )}
                onClick={() => {
                  if (damageCodeId) {
                    field.onChange(item)
                  } else {
                    setError('damageCode', {
                      message: t('assessmentItems.validation.damageCodeId'),
                      type: 'required',
                    })
                    toast.error(
                      t('assessmentItems.messages.damageCodeRequired')
                    )
                  }
                }}
                disabled={isPending}
              >
                {t(ASSESSMENT_ITEMS_TARIFF_TRANSLATE_KEY[item])}
              </button>
            ))}
            <button
              type='button'
              className={cn(
                'rounded-md border border-border px-1.5 py-0.5 text-xs font-medium transition-colors',
                !field.value &&
                  'border-primary-200 bg-primary-100/30 text-primary-700'
              )}
              onClick={() => {
                setValue('amountItem', tariffAmountItemRemain)
                setValue('overrideRatio', null)
                field.onChange(null)
              }}
            >
              {t('assessmentItems.dialog.tariff.custom')}
            </button>
          </FormItem>
        )
      }}
    />
  )
}
