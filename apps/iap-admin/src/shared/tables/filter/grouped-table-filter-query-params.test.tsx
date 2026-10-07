import { i18n, i18nReady } from '@shared/i18n/i18n'
import { GroupedTableFilterQueryParams } from '@shared/tables/filter/grouped-table-filter-query-params'
import type {
  TableFilterGroup,
  TableFilterValues,
} from '@shared/tables/filter/types'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView'
)

const route = vi.hoisted(() => ({
  search: {} as TableFilterValues,
  navigate: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => route.search,
  useRouter: () => ({ navigate: route.navigate }),
}))
const groups: TableFilterGroup[] = [
  {
    id: 'first',
    title: 'First group',
    filters: [
      {
        type: 'text',
        config: { id: 'name', asLike: true, placeholder: 'Name' },
      },
      {
        type: 'numberRange',
        config: {
          id: 'amount',
          fromPlaceholder: 'Minimum',
          toPlaceholder: 'Maximum',
        },
      },
      { type: 'text', config: { id: 'extra', placeholder: 'Extra' } },
    ],
  },
  {
    id: 'second',
    title: 'Second group',
    filters: [{ type: 'text', config: { id: 'other', placeholder: 'Other' } }],
  },
]
function applyNavigation(previous = route.search) {
  return route.navigate.mock.lastCall![0].search(previous) as TableFilterValues
}
describe('Grouped URL filters', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    )
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
    route.search = {}
    route.navigate.mockReset()
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    if (originalScrollIntoView)
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollIntoView',
        originalScrollIntoView
      )
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  })
  it('preserves group order and expands all groups without URL navigation', () => {
    render(<GroupedTableFilterQueryParams groups={groups} />)
    expect(
      screen.getAllByRole('heading').map((node) => node.textContent)
    ).toEqual(['First group', 'Second group'])
    expect(screen.queryByPlaceholderText('Extra')).toBeNull()
    const expand = screen.getByRole('button', { name: i18n.t('common.more') })
    expect(expand.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(expand)
    expect(screen.getByPlaceholderText('Extra')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.collapse') })
    )
    expect(screen.queryByPlaceholderText('Extra')).toBeNull()
    expect(route.navigate).not.toHaveBeenCalled()
  })
  it('reads and writes like keys immutably and returns pagination to page one', () => {
    route.search = {
      name__like: 'Existing',
      page: '5',
      pageSize: '40',
      sort: 'id',
      retained: 'value',
    }
    render(<GroupedTableFilterQueryParams groups={groups} />)
    expect(
      (screen.getByPlaceholderText('Name') as HTMLInputElement).value
    ).toBe('Existing')
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: ' Next ' },
    })
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    expect(applyNavigation()).toEqual({
      ...route.search,
      name__like: 'Next',
      page: '1',
    })
    expect(route.search.page).toBe('5')
    expect(route.navigate.mock.lastCall![0].replace).toBe(true)
  })
  it('reset clears all URL parameters and cancels unpublished changes', () => {
    route.search = { committed: 'value', ignored: 'keep out of detection' }
    render(
      <GroupedTableFilterQueryParams
        groups={groups}
        ignoreQueryParams={['ignored']}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Pending' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.resetFilter') })
    )
    expect(applyNavigation()).toEqual({})
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(route.navigate).toHaveBeenCalledTimes(1)
    expect(
      (screen.getByPlaceholderText('Name') as HTMLInputElement).value
    ).toBe('')
  })
  it('excludes control and ignored parameters from reset detection', () => {
    route.search = {
      page: '3',
      pageSize: '40',
      sort: 'id',
      sortDirection: 'asc',
      ignored: 'value',
    }
    render(
      <GroupedTableFilterQueryParams
        groups={groups}
        ignoreQueryParams={['ignored']}
      />
    )
    expect(
      screen.queryByRole('button', { name: i18n.t('common.resetFilter') })
    ).toBeNull()
  })
  it('supports custom range keys and hidden reset', () => {
    route.search = { lower: '12', page: '1' }
    render(
      <GroupedTableFilterQueryParams
        groups={[
          {
            id: 'range',
            title: 'Range',
            filters: [
              {
                type: 'numberRange',
                config: {
                  id: 'amount',
                  fromKey: 'lower',
                  fromPlaceholder: 'Minimum',
                },
              },
            ],
          },
        ]}
        showReset={false}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('Minimum'), {
      target: { value: '' },
    })
    expect(applyNavigation()).toEqual({})
    expect(
      screen.queryByRole('button', { name: i18n.t('common.resetFilter') })
    ).toBeNull()
    expect(
      screen.queryByRole('button', { name: i18n.t('common.more') })
    ).toBeNull()
  })
  it('uses reference numeric suffixes without overwriting the other bound', () => {
    route.search = { amount__fromNum: '10', amount__toNum: '90' }
    render(<GroupedTableFilterQueryParams groups={groups} />)
    expect(
      (screen.getByPlaceholderText('Minimum') as HTMLInputElement).value
    ).toBe('10')
    fireEvent.change(screen.getByPlaceholderText('Maximum'), {
      target: { value: '100' },
    })
    expect(applyNavigation()).toEqual({
      amount__fromNum: '10',
      amount__toNum: '100',
    })
  })
  it('renders both date modes and publishes faceted selection using the shared control', () => {
    render(
      <GroupedTableFilterQueryParams
        defaultVisibleFilterCount={3}
        groups={[
          {
            id: 'mixed',
            title: 'Mixed',
            filters: [
              {
                type: 'dateRange',
                config: {
                  id: 'date',
                  fromPlaceholder: 'Start date',
                  toPlaceholder: 'End date',
                },
              },
              {
                type: 'dateTimeRange',
                config: {
                  id: 'time',
                  fromPlaceholder: 'Start time',
                  toPlaceholder: 'End time',
                },
              },
              {
                type: 'faceted',
                config: {
                  id: 'status',
                  placeholder: 'Status',
                  options: [{ label: 'Active', value: 'ACTIVE' }],
                },
              },
            ],
          },
        ]}
      />
    )
    expect(screen.getByRole('button', { name: /Start date/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Start time/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Active' }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(applyNavigation()).toEqual({ status: ['ACTIVE'] })
  })
})
