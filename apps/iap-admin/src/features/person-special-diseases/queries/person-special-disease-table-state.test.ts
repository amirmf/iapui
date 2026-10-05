import { describe, expect, it } from 'vitest'

import { personSpecialDiseaseRouteSearchSchema } from '../model/person-special-disease-route-search-schema'
import {
  parsePersonSpecialDiseaseTableSearch,
  toPersonSpecialDiseaseTableSearch,
} from './person-special-disease-table-state'

describe('person special disease table URL state', () => {
  it('preserves every non-pagination filter while parsing the reference pagination contract', () => {
    const state = parsePersonSpecialDiseaseTableSearch({
      nationalCode: '0012345678',
      page: '3',
      size: '50',
      sort: 'createdAt',
    })

    expect(state).toEqual({
      filters: { nationalCode: '0012345678', sort: 'createdAt' },
      pagination: { pageIndex: 2, pageSize: 50 },
    })
  })

  it('serializes pagination without altering server filters', () => {
    const state = parsePersonSpecialDiseaseTableSearch({
      nationalCode: '0012345678',
    })

    expect(
      toPersonSpecialDiseaseTableSearch({
        ...state,
        pagination: { pageIndex: 1, pageSize: 20 },
      })
    ).toEqual({
      nationalCode: '0012345678',
      page: '2',
      size: '20',
    })
  })

  it('falls back to the standard first page and page size for invalid URL controls', () => {
    expect(
      parsePersonSpecialDiseaseTableSearch({
        page: '-1',
        size: 'many',
        sort: 'createdAt',
      })
    ).toEqual({
      filters: { sort: 'createdAt' },
      pagination: { pageIndex: 0, pageSize: 40 },
    })
  })

  it('accepts source-backed arbitrary filter keys', () => {
    expect(
      personSpecialDiseaseRouteSearchSchema.parse({
        anySourceFilter: 'value',
        page: '2',
      })
    ).toEqual({ anySourceFilter: 'value', page: '2' })
  })
})
