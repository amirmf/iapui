import { i18n, i18nReady } from '@shared/i18n/i18n'
import type { SortingState, Updater } from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { PaginatedDataTable } from './paginated-data-table'
import { TwoLineCell, TwoLineHeader } from './two-line-cell'

const columns = [{ accessorKey: 'title', header: 'Title' }]
const defaults = {
  columns,
  data: [{ title: 'Agreement' }],
  onPaginationChange: vi.fn(),
  pageCount: 3,
  pagination: { pageIndex: 0, pageSize: 40 },
  presentation: 'reference' as const,
}
const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView'
)

describe('reference table presentation', () => {
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
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    if (originalScrollIntoView)
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollIntoView',
        originalScrollIntoView
      )
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  })

  it('propagates reference two-line headers and sorts through source translated menu actions', async () => {
    vi.stubGlobal('PointerEvent', MouseEvent)
    const onSortingChange = vi.fn((updater: Updater<SortingState>) =>
      typeof updater === 'function' ? updater([]) : updater
    )
    render(
      <PaginatedDataTable
        {...defaults}
        columns={[
          {
            accessorKey: 'title',
            header: ({ column }) => (
              <TwoLineHeader
                column={column}
                presentation='reference'
                primary='Contract'
                secondary='Policy'
              />
            ),
          },
        ]}
        onSortingChange={onSortingChange}
      />
    )
    const trigger = screen.getByRole('button', { name: 'Contract' })
    expect(screen.getByRole('button', { name: 'Policy' })).toBeTruthy()
    const open = () =>
      fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })
    open()
    const ascending = await screen.findByRole('menuitem', {
      name: i18n.t('common.asc'),
    })
    expect(
      screen.getByRole('menuitem', { name: i18n.t('common.desc') })
    ).toBeTruthy()
    expect(
      screen.getByRole('menuitem', { name: i18n.t('common.reset') })
    ).toBeTruthy()
    expect(ascending.querySelector('svg')?.classList.contains('size-3.5')).toBe(
      true
    )
    fireEvent.click(ascending)
    expect(onSortingChange.mock.results.at(-1)?.value).toEqual([
      { id: 'title', desc: false },
    ])
    open()
    fireEvent.click(
      await screen.findByRole('menuitem', { name: i18n.t('common.desc') })
    )
    expect(onSortingChange.mock.results.at(-1)?.value).toEqual([
      { id: 'title', desc: true },
    ])
    open()
    fireEvent.click(
      await screen.findByRole('menuitem', { name: i18n.t('common.reset') })
    )
    expect(onSortingChange.mock.results.at(-1)?.value).toEqual([])
  })

  it('uses source translated selection counts, totals, page status and all six page sizes', async () => {
    render(<PaginatedDataTable {...defaults} hasCheckboxes totalCount={120} />)
    expect(
      screen.getByText(
        i18n.t('dataTable.rowsSelected', { selected: 0, total: 1 })
      )
    ).toBeTruthy()
    expect(screen.getByText(`${i18n.t('dataTable.total')}: 120`)).toBeTruthy()
    expect(
      screen.getByText(
        i18n.t('dataTable.pageIndicator', { page: 1, pageCount: 3 })
      )
    ).toBeTruthy()
    expect(
      screen.getByRole('checkbox', { name: i18n.t('dataTable.selectAllRows') })
    ).toBeTruthy()
    expect(
      screen.getByRole('checkbox', { name: i18n.t('dataTable.selectRow') })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('combobox'))
    const options = await screen.findAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      '10',
      '20',
      '30',
      '40',
      '50',
      '100',
    ])
  })

  it('keeps source compact visibility, button dimensions, responsive endpoints and RTL arrows', () => {
    render(
      <PaginatedDataTable
        {...defaults}
        hasCheckboxes
        smallPagination
        totalCount={0}
      />
    )
    const selected = screen.getByText(
      i18n.t('dataTable.rowsSelected', { selected: 0, total: 1 })
    )
    expect(selected.classList.contains('sm:hidden')).toBe(true)
    expect(
      screen
        .getByText(`${i18n.t('dataTable.total')}: -`)
        .classList.contains('sm:hidden')
    ).toBe(true)
    expect(
      screen
        .getByText(i18n.t('dataTable.rowsPerPage'))
        .classList.contains('sm:hidden')
    ).toBe(true)
    for (const label of ['Go to first page', 'Go to last page']) {
      const button = screen.getByRole('button', { name: label })
      expect(button.classList.contains('hidden')).toBe(true)
      expect(button.classList.contains('lg:flex')).toBe(true)
      expect(button.classList.contains('h-8')).toBe(true)
      expect(button.classList.contains('w-8')).toBe(true)
      expect(
        button.querySelector('svg')?.classList.contains('rtl:rotate-180')
      ).toBe(true)
    }
    expect(
      screen
        .getByRole('button', { name: 'Go to first page' })
        .hasAttribute('disabled')
    ).toBe(true)
    expect(
      screen
        .getByRole('button', { name: 'Go to next page' })
        .hasAttribute('disabled')
    ).toBe(false)
  })

  it('uses source empty content for an empty backend result even with active filters', () => {
    render(
      <PaginatedDataTable
        {...defaults}
        data={[]}
        hasActiveFilters
        emptyStateText='Source empty'
        noResultsContent='Filtered only'
      />
    )
    expect(screen.getByText('Source empty')).toBeTruthy()
    expect(screen.queryByText('Filtered only')).toBeNull()
  })

  it('uses the source loading and default empty translation keys', () => {
    const { rerender } = render(<PaginatedDataTable {...defaults} isLoading />)
    expect(screen.getByText(i18n.t('dataTable.loading'))).toBeTruthy()
    rerender(<PaginatedDataTable {...defaults} data={[]} />)
    expect(screen.getByText(i18n.t('dataTable.empty'))).toBeTruthy()
  })

  it('renders source ASCII hyphens for nullish two-line values while retaining zero', () => {
    const { rerender } = render(
      <TwoLineCell emptyValue='-' primary={null} secondary={undefined} />
    )
    expect(screen.getAllByText('-')).toHaveLength(2)
    rerender(<TwoLineCell emptyValue='-' primary={0} secondary={null} />)
    expect(screen.getByText('0')).toBeTruthy()
    expect(screen.getAllByText('-')).toHaveLength(1)
  })
  it('forwards scoped row classes without changing default rows', () => {
    render(
      <PaginatedDataTable
        {...defaults}
        data={[{ title: 'VIP' }, { title: 'Ordinary' }]}
        getRowClassName={(row) =>
          row.original.title === 'VIP'
            ? 'special-disease-row bg-primary/10'
            : undefined
        }
      />
    )
    expect(screen.getByText('VIP').closest('tr')?.className).toContain(
      'special-disease-row'
    )
    expect(screen.getByText('VIP').closest('tr')?.className).toContain(
      'bg-primary/10'
    )
    expect(screen.getByText('Ordinary').closest('tr')?.className).not.toContain(
      'special-disease-row'
    )
    expect(screen.getByText('Ordinary').closest('tr')?.className).toContain(
      'hover:bg-muted/50'
    )
  })
})
