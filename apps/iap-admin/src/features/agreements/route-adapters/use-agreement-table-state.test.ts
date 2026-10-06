import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAgreementTableState } from './use-agreement-table-state'

const route = vi.hoisted(() => ({
  navigate: vi.fn(),
  search: {} as Record<string, string>,
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: route.navigate }),
  useRouterState: () => route.search,
}))

describe('Agreement URL table state', () => {
  beforeEach(() => {
    route.navigate.mockClear()
    route.search = {}
  })
  it('uses the reference 40-row default and forwards sorting and date filters', () => {
    route.search = {
      direction: 'desc',
      sort: 'fromDate',
      thruDate__from: '2026-01-01',
    }
    const { result } = renderHook(() => useAgreementTableState())
    expect(result.current.pagination).toEqual({ pageIndex: 0, pageSize: 40 })
    expect(result.current.filters).toEqual(route.search)
    act(() => result.current.onPaginationChange({ pageIndex: 1, pageSize: 40 }))
    expect(route.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: { ...route.search, page: '2', size: '40' },
      })
    )
  })
})
