import { format } from 'date-fns'
import { format as formatJalali } from 'date-fns-jalali'

const TEHRAN_TIME_ZONE = 'Asia/Tehran'

function getLanguage() {
  if (typeof document === 'undefined') return 'fa'

  return document.documentElement.lang || 'fa'
}

function toTehranDate(date: string | Date): Date | undefined {
  const parsedDate =
    typeof date === 'string' ? new Date(normalizeIsoDate(date)) : date

  if (Number.isNaN(parsedDate.getTime())) return undefined

  return new Date(
    parsedDate.toLocaleString('en-US', { timeZone: TEHRAN_TIME_ZONE })
  )
}

export function normalizeIsoDate(date: string): string {
  const hasTime = date.includes('T')
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(date)

  return hasTime && !hasTimezone ? `${date}Z` : date
}

export function formatDateTime(
  date: string | Date | null | undefined,
  pattern?: string
): string {
  if (!date) return '-'
  const tehranDate = toTehranDate(date)

  if (!tehranDate) return '-'

  return getLanguage() === 'fa'
    ? formatJalali(tehranDate, pattern || 'yyyy/MM/dd HH:mm')
    : format(tehranDate, pattern || 'MMM d, yyyy HH:mm')
}

export function formatDate(
  date: string | Date | null | undefined,
  pattern = 'MMM d, yyyy'
): string {
  if (!date) return '-'
  const tehranDate = toTehranDate(date)

  if (!tehranDate) return '-'

  return getLanguage() === 'fa'
    ? formatJalali(tehranDate, 'yyyy/MM/dd')
    : format(tehranDate, pattern)
}
