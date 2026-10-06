// @vitest-environment jsdom
import { AssignementRuleDataTableToolbar } from '@features/assignement-rules/components/assignement-rule-data-table-toolbar'
import { i18nReady } from '@shared/i18n/i18n'
import type { TableFilterBaseProps } from '@shared/tables/filter/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { filter } = vi.hoisted(() => ({
  filter: vi.fn<(props: TableFilterBaseProps) => null>(),
}))
vi.mock('@shared/tables', () => ({ TableFilterQueryParams: filter }))
vi.mock('@modules/doc-types', () => ({
  useDocTypesData: {
    optionsCode: () => ({ options: [{ label: 'Document', value: 'DOC_1' }] }),
  },
}))

describe('AssignementRuleDataTableToolbar', () => {
  beforeEach(async () => {
    await i18nReady
    filter.mockClear()
  })
  afterEach(cleanup)

  it('configures text, number range, date range, and faceted filters', async () => {
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <AssignementRuleDataTableToolbar />
      </QueryClientProvider>
    )

    await waitFor(() => expect(filter).toHaveBeenCalled())

    const props = filter.mock.lastCall?.[0] as TableFilterBaseProps
    expect(props.textFilters?.map((f) => f.id)).toEqual([
      'title',
      'extPolicyId',
      'extContractId',
      'extWorkUnitCode',
      'mainAssignedUserUsername',
    ])
    expect(props.numberRangeFilters?.map((f) => f.id)).toEqual([
      'amountMin',
      'amountMax',
      'amountApprovedMin',
      'amountApprovedMax',
    ])
    expect(props.dateRangeFilters?.map((f) => f.id)).toEqual([
      'fromDate',
      'thruDate',
    ])
    expect(props.facetedFilters?.map((f) => f.id)).toEqual([
      'status',
      'docTypeCode',
    ])
  })
})
