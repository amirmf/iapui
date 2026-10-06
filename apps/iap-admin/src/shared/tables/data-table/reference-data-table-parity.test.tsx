import { useState } from 'react'

import { i18n, i18nReady } from '@shared/i18n/i18n'
import { PaginatedDataTable } from '@shared/tables/data-table/paginated-data-table'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

function ReferenceTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 40 })
  return (
    <PaginatedDataTable
      columns={[{ accessorKey: 'title', header: 'Title' }]}
      data={[{ title: 'row' }]}
      pageCount={3}
      totalCount={90}
      pagination={pagination}
      onPaginationChange={setPagination}
      hasCheckboxes
      presentation='reference'
      rowSelection={{ '0': true }}
    />
  )
}

describe('reference table presentation', () => {
  beforeEach(async () => {
    await i18nReady
  })
  afterEach(cleanup)
  it('renders both source translated totals and selected-row counts', () => {
    const { container } = render(<ReferenceTable />)
    expect(
      screen.getByText(
        i18n.t('dataTable.rowsSelected', { selected: 1, total: 1 })
      )
    ).toBeTruthy()
    expect(screen.getByText(`${i18n.t('dataTable.total')}: 90`)).toBeTruthy()
    expect(screen.getByText(i18n.t('dataTable.rowsPerPage'))).toBeTruthy()
    expect(
      screen.getByText(
        i18n.t('dataTable.pageIndicator', { page: 1, pageCount: 3 })
      )
    ).toBeTruthy()
    expect(screen.getByRole('combobox').textContent).toContain('40')
    expect(
      screen.getByRole('checkbox', { name: i18n.t('dataTable.selectRow') })
        .className
    ).toContain('ms-2')
    expect(container.querySelector('thead')?.className).toContain('z-20')
    expect(container.querySelector('td')?.className).toContain('p-2')
    expect(container.querySelector('th')?.className).toContain('text-left')
    expect(
      screen.getByRole('button', { name: 'Go to last page' }).className
    ).toContain('lg:flex')
  })
})
