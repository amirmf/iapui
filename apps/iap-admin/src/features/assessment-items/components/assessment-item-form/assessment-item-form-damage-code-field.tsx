import { useEffect, useMemo } from 'react'

import { type AssessmentItemFormType } from '@features/assessment-items/model/assessment-item-form-contract'
import useDamageCodeById from '@features/assessment-items/queries/use-damage-code-by-id.ts'
import useDamageCodeSearchData from '@features/assessment-items/queries/use-damage-code-search-data'
import useDebouncedTextSearch from '@features/assessment-items/queries/use-debounced-text-search'
import { type ClaimRequest } from '@iap/api-types'
import { type DamageCode } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface DamageCodeFieldProps {
  isEdit: boolean
  claimRequestData?: ClaimRequest
}

export function AssessmentItemFormDamageCodeField(props: DamageCodeFieldProps) {
  const { isEdit, claimRequestData } = props
  const { t } = useTranslate()
  const { control, setValue } = useFormContext<AssessmentItemFormType>()
  const { search, setSearch, text } = useDebouncedTextSearch({ useText: true })

  useEffect(() => {
    if (
      !isEdit &&
      claimRequestData?.docType?.docTypeCode ===
        import.meta.env.VITE_ASSESSMENT_ITEM_DAMAGE_CODE_VISIT_DOC_TYPE &&
      claimRequestData?.docType?.docType
    ) {
      setSearch(claimRequestData?.docType?.docType)
    }
  }, [
    claimRequestData?.docType?.docType,
    claimRequestData?.docType?.docTypeCode,
    isEdit,
    setSearch,
  ])

  const damageCode = useWatch<AssessmentItemFormType>({
    control,
    name: 'damageCode',
  }) as DamageCode

  const { data: damageCodes, isFetching: isDamageCodesLoading } =
    useDamageCodeSearchData({
      title: search,
      // enabled: isOpen,
      // status: 'ACTIVE',
    })

  const { data: getById } = useDamageCodeById({
    damageCodeId: damageCode?.id,
    enabled: isEdit,
  })

  const damageCodeItems = damageCodes?.content?.map((d) => ({
    label: d.title || d.code,
    value: d.id,
  }))

  const selectedEdit = useMemo(() => {
    if (getById && getById.title && getById.id) {
      return {
        label: getById.title,
        value: getById.id,
      }
    }
    return null
  }, [getById])

  const damageCodeSelected = damageCode?.id
    ? {
        label: damageCode?.title || '',
        value: damageCode?.id || '',
      }
    : null

  const finalSelected = selectedEdit || damageCodeSelected

  return (
    <FormField
      control={control}
      name='damageCode'
      render={({ field }) => {
        const handleDamageCodeChange = (damageCodeId: string | undefined) => {
          if (!damageCodeId) {
            field.onChange({
              id: null,
              code: null,
              title: null,
            })
            return
          }

          const selectedDamageCode = damageCodes?.content?.find(
            (d) => d.id === damageCodeId
          )

          if (selectedDamageCode?.status !== 'ACTIVE') {
            toast.error(t('assessmentItems.messages.inactiveDamageCode'))
            return
          }
          if (selectedDamageCode) {
            setValue(
              'toothNumbers',
              selectedDamageCode.isDentalService === 1 ? [] : null
            )
            setValue('toothType', 'PERMANENT')
            setValue('tariff', 'PRIVATE_SECTOR_TARIFF')
            if (selectedDamageCode.isDentalService === 1) {
              setValue('quantity', '1')
              setValue('tariff', null)
            }
            field.onChange(selectedDamageCode)
          }
        }

        return (
          <FormItem>
            <FormLabel>
              {t('assessmentItems.dialog.fields.damageCodeId')}
            </FormLabel>
            <FormControl>
              <SearchableSelect
                presentation='reference'
                selectText={t('common.select')}
                loadingText={t('common.loading')}
                emptyText={t('common.noResults')}
                clearText={t('common.clear')}
                selected={finalSelected}
                onChange={handleDamageCodeChange}
                items={damageCodeItems ?? []}
                isLoading={isDamageCodesLoading}
                onSearch={setSearch}
                search={text}
                placeholder={t(
                  'assessmentItems.dialog.fields.selectDamageCode'
                )}
                shouldFilter={false}
              />
            </FormControl>
            <FormMessage className='text-xs' />
          </FormItem>
        )
      }}
    />
  )
}
