import {
  formatDate as formatUiDate,
  formatDateTime as formatUiDateTime,
} from '@iap/ui'
import { i18n } from '@shared/i18n/i18n'

export function formatDateTime(
  date: string | Date | null | undefined,
  pattern?: string
) {
  return formatUiDateTime(date, pattern, {
    language: i18n.language,
    normalizeTimezone: false,
  })
}

export function formatDate(
  date: string | Date | null | undefined,
  pattern?: string
) {
  return formatUiDate(date, pattern, {
    language: i18n.language,
    normalizeTimezone: false,
  })
}
