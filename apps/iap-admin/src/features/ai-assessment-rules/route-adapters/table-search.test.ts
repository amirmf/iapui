import { describe, expect, it } from 'vitest'

import {
  parseAiAssessmentRuleTableSearch,
  toAiAssessmentRuleApiFilters,
  toAiAssessmentRuleTableSearch,
} from './table-search'

describe('table-search adapter', () => {
  it('parses empty search params with defaults', () => {
    const parsed = parseAiAssessmentRuleTableSearch({})
    expect(parsed.pagination).toEqual({ pageIndex: 0, pageSize: 30 })
    expect(parsed.sorting).toEqual([])
    expect(parsed.filters).toEqual({})
  })

  it('parses pagination, sorting, and filters correctly', () => {
    const parsed = parseAiAssessmentRuleTableSearch({
      agreementTemplateCode: 'TMP123',
      direction: 'desc',
      page: '3',
      size: '50',
      sort: 'definitionType',
    })
    expect(parsed.pagination).toEqual({ pageIndex: 2, pageSize: 50 })
    expect(parsed.sorting).toEqual([{ desc: true, id: 'definitionType' }])
    expect(parsed.filters).toEqual({ agreementTemplateCode: 'TMP123' })
  })

  it('serializes table search state back to URL search params', () => {
    const search = toAiAssessmentRuleTableSearch({
      filters: { agreementTemplateCode: 'TMP123' },
      pagination: { pageIndex: 1, pageSize: 20 },
      sorting: [{ desc: false, id: 'status' }],
    })
    expect(search).toEqual({
      agreementTemplateCode: 'TMP123',
      direction: 'asc',
      page: '2',
      size: '20',
      sort: 'status',
    })
  })

  it('converts filters for API request', () => {
    const apiFilters = toAiAssessmentRuleApiFilters({
      agreementTemplateCode: 'TMP1',
      definitionType: ['GENERAL', 'CONTRACT'],
    })
    expect(apiFilters).toEqual({
      agreementTemplateCode: 'TMP1',
      definitionType: ['GENERAL', 'CONTRACT'],
    })
  })
})
