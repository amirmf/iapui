import type { MedicalCenterInvoiceState } from '@iap/api-types'
import type { TFunction } from 'i18next'

const states: MedicalCenterInvoiceState[] = [
  'SUBMITTED',
  'EXTRACTING',
  'EXTRACTED',
  'FAILED',
]

export const MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS: Record<
  MedicalCenterInvoiceState,
  | 'medicalCenter.states.SUBMITTED'
  | 'medicalCenter.states.EXTRACTING'
  | 'medicalCenter.states.EXTRACTED'
  | 'medicalCenter.states.FAILED'
> = {
  SUBMITTED: 'medicalCenter.states.SUBMITTED',
  EXTRACTING: 'medicalCenter.states.EXTRACTING',
  EXTRACTED: 'medicalCenter.states.EXTRACTED',
  FAILED: 'medicalCenter.states.FAILED',
}

export const MEDICAL_CENTER_INVOICE_STATE_COLORS: Record<
  MedicalCenterInvoiceState,
  string
> = {
  SUBMITTED: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  EXTRACTING:
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  EXTRACTED:
    'bg-emerald-100/30 text-emerald-900 dark:text-emerald-200 border-emerald-200',
  FAILED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
}

export function getMedicalCenterInvoiceStateOptions(t: TFunction) {
  return states.map((state) => ({
    label: t(MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS[state]),
    value: state,
  }))
}
