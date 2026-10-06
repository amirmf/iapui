import { describe, expect, it } from 'vitest'

import {
  parseAssignementRuleTableSearch,
  toAssignementRuleTableSearch,
} from './table-search'

describe('table-search adapter', () => {
  it('parses empty search object to default pagination and empty filters', () => {
    const parsed = parseAssignementRuleTableSearch({})
    expect(parsed).toEqual({
      filters: {},
      pagination: {
        pageIndex: 0,
        pageSize: 30,
      },
    })
  })

  it('parses valid page and size and retains extra query filters', () => {
    const parsed = parseAssignementRuleTableSearch({
      page: '3',
      size: '50',
      status: 'ACTIVE',
      title: 'Surgery',
    })

    expect(parsed).toEqual({
      filters: {
        status: 'ACTIVE',
        title: 'Surgery',
      },
      pagination: {
        pageIndex: 2,
        pageSize: 50,
      },
    })
  })

  it('serializes state back to URL query object', () => {
    const serialized = toAssignementRuleTableSearch({
      filters: {
        docTypeCode: 'DOC1',
        title: 'Test',
      },
      pagination: {
        pageIndex: 1,
        pageSize: 25,
      },
    })

    expect(serialized).toEqual({
      docTypeCode: 'DOC1',
      page: '2',
      size: '25',
      title: 'Test',
    })
  })
})
