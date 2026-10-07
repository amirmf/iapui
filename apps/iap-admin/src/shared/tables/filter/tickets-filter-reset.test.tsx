// @vitest-environment jsdom
import { TableFilterQueryParams } from '@shared/tables/filter/table-filter-query-params'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  navigate: vi.fn(),
  search: {
    status: 'CLOSED',
    features: 'tickets',
    page: '3',
    priority: ['HIGH'],
  },
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: state.search }),
  useRouter: () => ({ navigate: state.navigate }),
}))
vi.mock('@shared/tables/filter/table-filter-shell', () => ({
  TableFilterShell: (props: {
    onReset: () => void
    children: React.ReactNode
  }) => (
    <>
      <button onClick={props.onReset}>Reset</button>
      {props.children}
    </>
  ),
}))
vi.mock('@shared/tables/filter/table-filter-content', () => ({
  TableFilterContent: (props: {
    onValueChange: (id: string, value: string) => void
  }) => (
    <button onClick={() => props.onValueChange('ticketNumber', '123')}>
      Filter
    </button>
  ),
}))
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
it('clears the full tickets URL when explicitly requested, and preserves default ignored keys', () => {
  const view = render(
    <TableFilterQueryParams
      ignoreQueryParams={['status', 'features']}
      resetIgnoredQueryParams
    />
  )
  fireEvent.click(view.getByText('Reset'))
  expect(state.navigate.mock.lastCall![0].search(state.search)).toEqual({})
  view.rerender(
    <TableFilterQueryParams ignoreQueryParams={['status', 'features']} />
  )
  fireEvent.click(view.getByText('Reset'))
  expect(state.navigate.mock.lastCall![0].search(state.search)).toEqual({
    status: 'CLOSED',
    features: 'tickets',
  })
})
it('writes the source page reset and keeps unrelated ticket filters', () => {
  const view = render(<TableFilterQueryParams resetPageToFirst />)
  fireEvent.click(view.getByText('Filter'))
  expect(state.navigate.mock.lastCall![0].search(state.search)).toEqual({
    ...state.search,
    page: '1',
    ticketNumber: '123',
  })
})
