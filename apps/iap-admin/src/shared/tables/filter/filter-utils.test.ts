import {
  isTableFiltered,
  tableFilterKeys,
  toTableFilterDate,
  updateTableFilterValue,
} from '@shared/tables/filter/filter-utils'
import { describe, expect, it } from 'vitest'

describe('table filter utilities', () => {
  it('removes empty values and retains meaningful filter values', () => {
    const withStatus = updateTableFilterValue({}, 'status', ['PENDING'])

    expect(withStatus).toEqual({ status: ['PENDING'] })
    expect(updateTableFilterValue(withStatus, 'status', [])).toEqual({})
  })

  it('excludes UI-only values when determining filter state', () => {
    expect(isTableFiltered({ page: '2', status: 'PENDING' }, ['page'])).toBe(
      true
    )
    expect(isTableFiltered({ page: '2' }, ['page'])).toBe(false)
  })

  it('uses stable range keys and date serialization', () => {
    expect(tableFilterKeys.dateFrom('createdAt')).toBe('createdAtFrom')
    expect(toTableFilterDate(new Date(2026, 8, 27))).toBe('2026-09-27')
  })
})
