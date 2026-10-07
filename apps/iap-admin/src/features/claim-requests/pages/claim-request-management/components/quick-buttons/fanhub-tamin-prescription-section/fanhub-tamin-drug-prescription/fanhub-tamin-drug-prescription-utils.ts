import type { FanhubDrugPrescription } from '@iap/api-types'

export type FinancialField =
  'phaPrice' | 'phaRequestPrice' | 'insurancePayment' | 'ssoPayment'

export const financialFields: FinancialField[] = [
  'phaPrice',
  'phaRequestPrice',
  'insurancePayment',
  'ssoPayment',
]

export const contributionFields = new Set<FinancialField>([
  'insurancePayment',
  'ssoPayment',
])

export function normalizeFinancialValue(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const normalizedValue = Number(value)
    return Number.isFinite(normalizedValue) ? normalizedValue : null
  }

  return null
}

export function displayValue(value: unknown, notAvailable: string): string {
  if (value === null || value === undefined) return notAvailable

  const stringValue = String(value).trim()
  return stringValue || notAvailable
}

export function calculateFinancialTotals(items: FanhubDrugPrescription[]) {
  return financialFields.reduce<Record<FinancialField, number>>(
    (currentTotals, field) => {
      currentTotals[field] = items.reduce((total, item) => {
        return total + (normalizeFinancialValue(item[field]) ?? 0)
      }, 0)
      return currentTotals
    },
    {
      phaPrice: 0,
      phaRequestPrice: 0,
      insurancePayment: 0,
      ssoPayment: 0,
    }
  )
}
