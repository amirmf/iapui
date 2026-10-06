import {
  assignementRuleIdsSchema,
  assignementRuleRequestSchema,
  assignementRuleSchema,
  assignementRuleStatusSchema,
  pageAssignementRuleSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('assignementRule contracts', () => {
  it('parses valid status values and throws on invalid', () => {
    expect(assignementRuleStatusSchema.parse('ACTIVE')).toBe('ACTIVE')
    expect(assignementRuleStatusSchema.parse('INACTIVE')).toBe('INACTIVE')
    expect(() => assignementRuleStatusSchema.parse('INVALID')).toThrow()
  })

  it('validates assignementRuleSchema', () => {
    const raw = {
      amountApprovedMax: 50000,
      amountApprovedMin: 1000,
      amountMax: 100000,
      amountMin: 500,
      docTypeCode: 'SURGERY',
      extContractId: 101,
      extPolicyId: 202,
      extWorkUnitCode: 303,
      fromDate: '2026-01-01T00:00:00Z',
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      mainAssignedUserUsername: 'doctor_1',
      status: 'ACTIVE',
      thruDate: '2026-12-31T23:59:59Z',
      title: 'Surgery Assignment Rule',
    }
    const parsed = assignementRuleSchema.parse(raw)
    expect(parsed).toEqual(raw)
  })

  it('validates pageAssignementRuleSchema with paginated content', () => {
    const pageData = {
      content: [
        {
          id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          title: 'Test Rule',
        },
      ],
      empty: false,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 1,
      size: 30,
      totalElements: 1,
      totalPages: 1,
    }
    const parsed = pageAssignementRuleSchema.parse(pageData)
    expect(parsed.content).toHaveLength(1)
    expect(parsed.totalElements).toBe(1)
  })

  it('validates assignementRuleRequestSchema', () => {
    const valid = assignementRuleRequestSchema.parse({
      status: 'ACTIVE',
      title: 'Create Rule',
    })
    expect(valid.title).toBe('Create Rule')
    expect(valid.status).toBe('ACTIVE')
  })

  it('validates assignementRuleIdsSchema', () => {
    const ids = ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11']
    expect(assignementRuleIdsSchema.parse(ids)).toEqual(ids)
    expect(() => assignementRuleIdsSchema.parse([])).toThrow()
  })
  it('rejects undeclared request properties at the API boundary', () => {
    expect(() =>
      assignementRuleRequestSchema.parse({
        status: 'ACTIVE',
        title: 'Rule',
        unexpected: true,
      })
    ).toThrow()
  })
})
