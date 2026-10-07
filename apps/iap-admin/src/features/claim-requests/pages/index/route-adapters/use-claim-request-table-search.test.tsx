import { useClaimRequestTableSearch } from '@features/claim-requests/pages/index/route-adapters/use-claim-request-table-search'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  search: {} as Record<string, unknown>,
  navigate: vi.fn(),
}))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { roles: [] } }),
  isDoctorRole: () => false,
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => state.search,
  useRouter: () => ({ navigate: state.navigate }),
}))

function writtenSearch() {
  const navigation = state.navigate.mock.lastCall![0]
  return navigation.search(state.search)
}

describe('source claim table control URL transitions', () => {
  beforeEach(() => {
    state.search = {}
    state.navigate.mockClear()
  })
  it('initializes visible sorting once while API sort inputs continue following URL', () => {
    state.search = { sort: 'amount', extNationalCode: '123' }
    const { result, rerender } = renderHook(() => useClaimRequestTableSearch())
    expect(result.current.sorting).toEqual([])
    expect(result.current.apiFilterSearch).toMatchObject({
      sort: 'amount',
      extNationalCode: '123',
    })
    const previousFilters = result.current.apiFilterSearch
    rerender()
    expect(result.current.apiFilterSearch).toBe(previousFilters)
    state.search = { sort: 'updatedAt', direction: 'desc' }
    rerender()
    expect(result.current.sorting).toEqual([])
    expect(result.current.apiFilterSearch).toMatchObject({
      sort: 'updatedAt',
      direction: 'desc',
    })
  })
  it('pagination only writes page and size, preserving unrelated sort/filter keys', () => {
    state.search = {
      page: '2',
      sort: 'amount',
      direction: 'desc',
      quickStatus: 'ALL',
      extNationalCode: '123',
    }
    const { result } = renderHook(() => useClaimRequestTableSearch())
    act(() => result.current.onPaginationChange({ pageIndex: 3, pageSize: 50 }))
    expect(writtenSearch()).toEqual({ ...state.search, page: '4', size: '50' })
  })
  it('sorting writes only its own keys and clears them without injecting defaults', () => {
    state.search = { page: '3', quickStatus: 'ALL' }
    const { result } = renderHook(() => useClaimRequestTableSearch())
    act(() => result.current.onSortingChange([{ id: 'amount', desc: true }]))
    expect(result.current.sorting).toEqual([{ id: 'amount', desc: true }])
    expect(writtenSearch()).toEqual({
      ...state.search,
      sort: 'amount',
      direction: 'desc',
    })
    state.search = writtenSearch()
    act(() => result.current.onSortingChange([]))
    expect(writtenSearch()).toEqual({ page: '3', quickStatus: 'ALL' })
  })
})
