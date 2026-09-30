import type {
  DamageCodePricing,
  DamageCodePricingForm,
  DamageCodeSummary,
} from '@iap/api-types'

export function getDamageCodePricingFormDefaults(
  damageCode: DamageCodeSummary | null,
  pricing?: DamageCodePricing | null
): DamageCodePricingForm {
  return {
    amount: pricing?.amount ?? 0,
    damageCodeId: pricing?.damageCodeId ?? damageCode?.id ?? '',
    fromDate: pricing?.fromDate ? new Date(pricing.fromDate) : undefined,
    priceType: pricing?.priceType ?? 'TOTAL',
    thruDate: pricing?.thruDate ? new Date(pricing.thruDate) : undefined,
    unit: pricing?.unit ?? '',
  }
}
