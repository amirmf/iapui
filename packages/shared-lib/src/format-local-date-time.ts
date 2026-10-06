import { format } from 'date-fns'

/** Formats the local Gregorian date without timezone or calendar conversion. */
export function formatLocalDateTime(
  date: string | Date | null | undefined,
  pattern = 'PPpp'
): string {
  if (!date) return '-'
  return format(typeof date === 'string' ? new Date(date) : date, pattern)
}
