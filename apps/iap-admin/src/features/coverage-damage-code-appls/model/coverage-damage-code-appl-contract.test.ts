import {
  coverageDamageCodeApplPageRequestSchema,
  coverageDamageCodeApplPageSchema,
  coverageDamageCodeApplSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

const coverageId = '550e8400-e29b-41d4-a716-446655440000'
const damageCodeId = '660e8400-e29b-41d4-a716-446655440000'
const mappingId = '770e8400-e29b-41d4-a716-446655440000'

describe('coverage damage code application contracts', () => {
  it('retains the reference audit fields and ISO datetime validation', () => {
    expect(
      coverageDamageCodeApplSchema.parse({
        coverageDetailId: coverageId,
        createdAt: '2026-01-01T00:00:00.000Z',
        createdBy: 'admin',
        damageCodeId,
        fromDate: '2026-01-01T00:00:00.000Z',
        id: mappingId,
        updatedAt: '2026-01-02T00:00:00.000Z',
        updatedBy: 'reviewer',
      })
    ).toMatchObject({ createdBy: 'admin', updatedBy: 'reviewer' })

    expect(
      coverageDamageCodeApplSchema.safeParse({
        createdAt: 'invalid-date',
        id: mappingId,
      }).success
    ).toBe(false)
  })

  it('uses the shared page request defaults for the reference page-full endpoint', () => {
    expect(coverageDamageCodeApplPageRequestSchema.parse({})).toEqual({
      filters: {},
      page: 0,
      size: 20,
    })
    expect(
      coverageDamageCodeApplPageSchema.parse({ content: [] }).content
    ).toEqual([])
  })
})
