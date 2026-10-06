import { describe, expect, it } from 'vitest'

import { assessmentPromptRouteSearchSchema } from './route-search-schema'
import {
  parseAssessmentPromptTableSearch,
  toAssessmentPromptApiFilters,
  toAssessmentPromptTableSearch,
} from './table-search'

describe('assessment prompt table URL state', () => {
  it('uses the reference default page size and accepts emitted facet arrays', () => {
    expect(parseAssessmentPromptTableSearch({}).pagination).toEqual({
      pageIndex: 0,
      pageSize: 40,
    })
    const facets = {
      status: ['ACTIVE', 'PENDING'],
      placeType: ['CLINIC'],
      ruleState: ['DISPLAY'],
      docTypeCode: ['D-1'],
    }
    expect(assessmentPromptRouteSearchSchema.parse(facets)).toEqual(facets)
    expect(
      assessmentPromptRouteSearchSchema.safeParse({ status: [1] }).success
    ).toBe(false)
  })
  it('preserves filters and maps pagination and sorting to the reference URL contract', () => {
    const state = parseAssessmentPromptTableSearch({
      'agreement.code': 'AG-1',
      direction: 'desc',
      page: '2',
      size: '20',
      sort: 'title',
      status: ['ACTIVE'],
      thruDate__from: '2026-01-01',
      thruDate__to: '2026-01-31',
    })

    expect(state).toEqual({
      filters: {
        'agreement.code': 'AG-1',
        status: ['ACTIVE'],
        thruDate__from: '2026-01-01',
        thruDate__to: '2026-01-31',
      },
      pagination: { pageIndex: 1, pageSize: 20 },
      sorting: [{ desc: true, id: 'title' }],
    })
    expect(toAssessmentPromptTableSearch(state)).toEqual({
      'agreement.code': 'AG-1',
      direction: 'desc',
      page: '2',
      size: '20',
      sort: 'title',
      status: ['ACTIVE'],
      thruDate__from: '2026-01-01',
      thruDate__to: '2026-01-31',
    })
  })

  it('sends date ranges and explicit sorting to the page endpoint', () => {
    expect(
      toAssessmentPromptApiFilters(
        { thruDate__from: '2026-01-01', thruDate__to: '2026-01-31' },
        [{ desc: false, id: 'prompt' }]
      )
    ).toEqual({
      direction: 'asc',
      sort: 'prompt',
      thruDate__from: '2026-01-01',
      thruDate__to: '2026-01-31',
    })
  })
})
