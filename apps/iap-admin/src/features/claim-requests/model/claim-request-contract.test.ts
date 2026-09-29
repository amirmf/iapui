import { claimRequestSchema, supportTicketSchema } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('ClaimRequestsPage API contracts', () => {
  it('accepts the nested reference response shapes', () => {
    expect(
      claimRequestSchema.safeParse({
        aiAssessmentResults: [
          { assessType: 'DUPLICATION', resolutionType: 'RETURN' },
        ],
        duplicates: [
          {
            duplicatesDetail: [{ duplicateScore: 0.91 }],
            type: 'IMAGE',
            validatorType: 'GENERAL',
          },
        ],
        objections: [{ roleType: 'EXPERT' }],
        subInsuredPeople: [{ age: 34, nationalCode: '1234567890' }],
        assignmentHistory: [{ assignedAt: '2026-01-01', role: 'EXPERT' }],
        statusHistory: [{ status: 'APPROVED', timestamp: '2026-01-01' }],
      }).success
    ).toBe(true)
    expect(
      supportTicketSchema.safeParse({
        assignmentHistory: [{ toAssignedUsername: 'expert' }],
        category: 'CLAIM_ISSUE',
        priority: 'HIGH',
        status: 'ASSIGNED',
        statusHistory: [{ fromStatus: 'OPEN', toStatus: 'ASSIGNED' }],
      }).success
    ).toBe(true)
  })

  it('rejects invalid nested enum values instead of accepting unknown data', () => {
    expect(
      claimRequestSchema.safeParse({
        aiAssessmentResults: [{ assessType: 'INVALID' }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        objections: [{ roleType: 'INVALID' }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        assignmentHistory: [{ assignedAt: 1 }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        statusHistory: [{ status: 'INVALID' }],
      }).success
    ).toBe(false)
    expect(supportTicketSchema.safeParse({ priority: 'INVALID' }).success).toBe(
      false
    )
    expect(
      supportTicketSchema.safeParse({
        statusHistory: [{ toStatus: 'INVALID' }],
      }).success
    ).toBe(false)
  })
})
