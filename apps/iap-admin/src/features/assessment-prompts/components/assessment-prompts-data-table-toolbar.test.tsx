import { i18n, i18nReady } from '@shared/i18n/i18n'
import type { TableFilterBaseProps } from '@shared/tables/filter/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssessmentPromptsDataTableToolbar } from './assessment-prompts-data-table-toolbar'

const { filter } = vi.hoisted(() => ({
  filter: vi.fn<(props: TableFilterBaseProps) => null>(),
}))
vi.mock('@shared/tables', () => ({ TableFilterQueryParams: filter }))
vi.mock('@modules/doc-types', () => ({
  useDocTypesData: {
    optionsCode: () => ({ options: [{ label: 'Document', value: 'CODE' }] }),
  },
}))
describe('AssessmentPromptsDataTableToolbar', () => {
  beforeEach(async () => {
    await i18nReady
    filter.mockClear()
  })
  afterEach(cleanup)
  it('provides every source filter and document codes, with URL control keys excluded from filtering', async () => {
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <AssessmentPromptsDataTableToolbar />
      </QueryClientProvider>
    )
    await waitFor(() =>
      expect(filter.mock.lastCall?.[0]).toMatchObject({
        facetedFilters: [
          {
            id: 'docTypeCode',
            options: [{ label: 'Document', value: 'CODE' }],
          },
          { id: 'ruleState' },
          { id: 'status' },
          { id: 'placeType' },
        ],
      })
    )
    const props = filter.mock.lastCall?.[0] as TableFilterBaseProps & {
      controlQueryParamKeys: string[]
      pageQueryParamKey: string
    }
    expect(
      props.textFilters?.map((item) => ({
        id: item.id,
        placeholder: item.placeholder,
        asLike: item.asLike,
      }))
    ).toEqual([
      {
        id: 'title',
        placeholder: i18n.t('assessmentPrompts.filters.title'),
        asLike: undefined,
      },
      {
        id: 'agreement.title',
        placeholder: i18n.t('assessmentPrompts.filters.agreementTitle'),
        asLike: undefined,
      },
      {
        id: 'agreement.code',
        placeholder: i18n.t('assessmentPrompts.filters.agreementCode'),
        asLike: undefined,
      },
    ])
    expect(props.dateRangeFilters).toEqual([
      expect.objectContaining({
        id: 'thruDate',
        fromPlaceholder: i18n.t('assessmentPrompts.filters.thruDateFrom'),
        toPlaceholder: i18n.t('assessmentPrompts.filters.thruDateTo'),
      }),
    ])
    expect(props.facetedFilters?.[0]?.multiple).toBe(false)
    expect(
      props.facetedFilters?.[3]?.options.map((option) => option.value)
    ).toEqual(['HOSPITAL', 'CLINIC', 'SURGERY_CENTER'])
    expect(props.controlQueryParamKeys).toEqual([
      'page',
      'size',
      'sort',
      'direction',
    ])
    expect(props.pageQueryParamKey).toBe('page')
    expect(props.defaultVisibleFilterCount).toBe(10)
    expect(props).toMatchObject({
      presentation: 'reference',
      resetPageToFirst: true,
      labels: { reset: i18n.t('common.resetFilter') },
    })
  })
})
