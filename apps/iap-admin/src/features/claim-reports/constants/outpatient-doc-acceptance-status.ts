import type {
  OutpatientDocAcceptanceStatus,
  OutpatientDocAcceptanceWsStatus,
} from '@iap/api-types'

export const outpatientDocAcceptanceStatusColors: Record<
  OutpatientDocAcceptanceStatus,
  string
> = {
  SUBMIT:
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  SENT_TO_SERVER:
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  REJECT: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  DELETED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  FAILED: 'bg-slate-300/30 text-slate-900 dark:text-slate-200 border-slate-200',
  SUCCESS:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
}

export const outpatientDocAcceptanceWsStatusColors: Record<
  OutpatientDocAcceptanceWsStatus,
  string
> = {
  FAILD: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PROGRESS: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  DONE: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
}

export const OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS: Record<
  OutpatientDocAcceptanceStatus,
  | 'outpatientDocAcceptances.status.SUBMIT'
  | 'outpatientDocAcceptances.status.SENT_TO_SERVER'
  | 'outpatientDocAcceptances.status.REJECT'
  | 'outpatientDocAcceptances.status.DELETED'
  | 'outpatientDocAcceptances.status.FAILED'
  | 'outpatientDocAcceptances.status.SUCCESS'
> = {
  SUBMIT: 'outpatientDocAcceptances.status.SUBMIT',
  SENT_TO_SERVER: 'outpatientDocAcceptances.status.SENT_TO_SERVER',
  REJECT: 'outpatientDocAcceptances.status.REJECT',
  DELETED: 'outpatientDocAcceptances.status.DELETED',
  FAILED: 'outpatientDocAcceptances.status.FAILED',
  SUCCESS: 'outpatientDocAcceptances.status.SUCCESS',
}

export const OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS: Record<
  OutpatientDocAcceptanceWsStatus,
  | 'outpatientDocAcceptances.wsStatus.FAILD'
  | 'outpatientDocAcceptances.wsStatus.PROGRESS'
  | 'outpatientDocAcceptances.wsStatus.DONE'
> = {
  FAILD: 'outpatientDocAcceptances.wsStatus.FAILD',
  PROGRESS: 'outpatientDocAcceptances.wsStatus.PROGRESS',
  DONE: 'outpatientDocAcceptances.wsStatus.DONE',
}

export function getOutpatientDocAcceptanceStatusOptions(
  t: (key: string) => string
): Array<{ label: string; value: OutpatientDocAcceptanceStatus }> {
  return Object.entries(OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS).map(
    ([status, translationKey]) => ({
      label: t(translationKey),
      value: status as OutpatientDocAcceptanceStatus,
    })
  )
}

export function getOutpatientDocAcceptanceWsStatusOptions(
  t: (key: string) => string
): Array<{ label: string; value: OutpatientDocAcceptanceWsStatus }> {
  return Object.entries(
    OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS
  ).map(([status, translationKey]) => ({
    label: t(translationKey),
    value: status as OutpatientDocAcceptanceWsStatus,
  }))
}
