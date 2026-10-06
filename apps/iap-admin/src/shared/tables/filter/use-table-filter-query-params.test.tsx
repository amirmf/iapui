import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
} from './filter-utils'
import { useTableFilterQueryParams } from './use-table-filter-query-params'

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate }),
}))

describe('useTableFilterQueryParams', () => {
  it('serializes filter, pagination, and sorting transitions into route search', () => {
    const { result } = renderHook(() =>
      useTableFilterQueryParams({
        parse: parseTableFilterSearch,
        search: {
          page: '3',
          pageSize: '40',
          status: 'PENDING',
        } satisfies TableFilterSearch,
        serialize: toTableFilterSearch,
      })
    )

    act(() =>
      result.current.onFiltersChange((filters) => ({
        ...filters,
        status: 'APPROVED',
      }))
    )

    expect(navigate).toHaveBeenLastCalledWith({
      replace: true,
      search: {
        page: '1',
        pageSize: '40',
        sort: undefined,
        sortDirection: undefined,
        status: 'APPROVED',
      },
      to: './',
    })

    act(() => result.current.onSortingChange([{ desc: true, id: 'createdAt' }]))

    expect(navigate).toHaveBeenLastCalledWith({
      replace: true,
      search: {
        page: '1',
        pageSize: '40',
        sort: 'createdAt',
        sortDirection: 'desc',
        status: 'PENDING',
      },
      to: './',
    })
  })
})
