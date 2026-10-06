import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime } from './format-date'

describe('date formatting source parity opt-in', () => {
  it('keeps default invalid-date placeholders and throws only when requested', () => {
    expect(formatDateTime('invalid')).toBe('-')
    expect(formatDate('invalid')).toBe('-')
    expect(() =>
      formatDateTime('invalid', undefined, { invalidDate: 'throw' })
    ).toThrow('Invalid time value')
    expect(() =>
      formatDate('invalid', undefined, { invalidDate: 'throw' })
    ).toThrow(RangeError)
    expect(formatDateTime(null, undefined, { invalidDate: 'throw' })).toBe('-')
  })
  it('uses source Tehran conversion and requested language for valid dates', () => {
    expect(
      formatDateTime('2026-10-06T00:00:00Z', undefined, {
        language: 'en',
        normalizeTimezone: false,
        invalidDate: 'throw',
      })
    ).toBe('Oct 6, 2026 03:30')
    expect(
      formatDateTime('2026-10-06T00:00:00Z', undefined, {
        language: 'fa',
        normalizeTimezone: false,
        invalidDate: 'throw',
      })
    ).toBe('1405/07/14 03:30')
  })
})
