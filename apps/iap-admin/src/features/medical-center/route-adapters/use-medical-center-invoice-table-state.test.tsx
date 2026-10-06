import { useMedicalCenterInvoiceTableState } from '@features/medical-center/route-adapters/use-medical-center-invoice-table-state'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  search: {} as Record<string, unknown>,
  navigate: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => mocks.search,
  useRouter: () => ({ navigate: mocks.navigate }),
}))
beforeEach(() => {
  mocks.search = {}
  mocks.navigate.mockReset()
})
describe('source Medical Center URL transitions', () => {
  it('sorting writes only sort and direction and keeps existing page values', () => {
    const { result } = renderHook(() => useMedicalCenterInvoiceTableState())
    act(() => result.current.onSortingChange([{ id: 'date', desc: true }]))
    const navigate = mocks.navigate.mock.calls[0][0]
    expect(navigate.search({ documentNumber: '7' })).toEqual({
      documentNumber: '7',
      sort: 'date',
      direction: 'desc',
    })
    expect(navigate.search({ page: '3', size: '80' })).toEqual({
      page: '3',
      size: '80',
      sort: 'date',
      direction: 'desc',
    })
    act(() => result.current.onSortingChange([]))
    expect(
      mocks.navigate.mock.calls[1][0].search({
        page: '3',
        sort: 'date',
        direction: 'desc',
      })
    ).toEqual({ page: '3' })
  })
  it('external search changes update filters and pagination without overwriting local sort', () => {
    mocks.search = { sort: 'createdAt', direction: 'asc', page: '3' }
    const { result, rerender } = renderHook(() =>
      useMedicalCenterInvoiceTableState()
    )
    mocks.search = {
      documentNumber: '9',
      page: '2',
      sort: 'date',
      direction: 'desc',
    }
    rerender()
    expect(result.current.sorting).toEqual([{ id: 'createdAt', desc: false }])
    expect(result.current.pagination.pageIndex).toBe(1)
    expect(result.current.filters).toEqual({ documentNumber: '9' })
    act(() =>
      result.current.setPagination((previous) => ({
        ...previous,
        pageIndex: 4,
      }))
    )
    expect(
      mocks.navigate.mock.calls[0][0].search({
        documentNumber: '9',
        sort: 'date',
      })
    ).toEqual({ documentNumber: '9', sort: 'date', page: '5', size: '40' })
  })
})
