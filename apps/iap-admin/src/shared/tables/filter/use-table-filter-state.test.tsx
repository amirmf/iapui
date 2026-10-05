import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTableFilterState } from './use-table-filter-state'

describe('useTableFilterState', () => {
  it('resets pagination when filters or sorting change', () => {
    const { result } = renderHook(() =>
      useTableFilterState({
        filters: { status: 'PENDING' },
        pagination: { pageIndex: 2, pageSize: 40 },
        sorting: [],
      })
    )

    act(() => result.current.onFilterValueChange('status', 'APPROVED'))

    expect(result.current).toMatchObject({
      filters: { status: 'APPROVED' },
      pagination: { pageIndex: 0, pageSize: 40 },
    })

    act(() => result.current.onPaginationChange({ pageIndex: 3, pageSize: 40 }))
    act(() => result.current.onSortingChange([{ desc: true, id: 'createdAt' }]))

    expect(result.current).toMatchObject({
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [{ desc: true, id: 'createdAt' }],
    })
  })
})
