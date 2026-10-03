import {
  coveragePageRequestSchema,
  coveragePageSchema,
  coverageSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

const coverageId = '550e8400-e29b-41d4-a716-446655440000'

describe('coverage contracts', () => {
  it('accepts the reference coverage response shape and Spring page metadata', () => {
    const coverage = coverageSchema.parse({
      code: 'MEDICAL',
      coverageType: 'GROUP',
      fromDate: '2026-01-01T00:00:00.000Z',
      id: coverageId,
      rootCoverageId: null,
      status: 'ACTIVE',
      title: 'پوشش درمان',
      typeIndicator: 'MEDICAL',
    })

    expect(
      coveragePageSchema.parse({
        content: [coverage],
        pageable: {
          pageNumber: 0,
          pageSize: 20,
          sort: { sorted: true, unsorted: false },
        },
        sort: { empty: false, sorted: true, unsorted: false },
        totalElements: 1,
      })
    ).toMatchObject({ content: [coverage], totalElements: 1 })
  })

  it('uses the shared page request defaults and rejects malformed datetimes', () => {
    expect(coveragePageRequestSchema.parse({})).toEqual({
      filters: {},
      page: 0,
      size: 20,
    })
    expect(
      coverageSchema.safeParse({
        createdAt: 'not-an-iso-date',
        id: coverageId,
      }).success
    ).toBe(false)
  })
})
