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
  it('validates the reference disease, attachment, document and document type fields', () => {
    expect(
      claimRequestSchema.parse({ specialDiseases: ['VIP', 'SACRIFICE'] })
        .specialDiseases
    ).toEqual(['VIP', 'SACRIFICE'])
    for (const input of [
      { specialDiseases: [{}] },
      { specialDiseases: ['UNKNOWN'] },
      { attachments: [{}] },
      { documents: [{ dataJsonSchema: {} }] },
      { documents: [{ extractedData: 'invalid' }] },
      { docType: { sequence: 1.5 } },
      { docType: { maxThreshold: 'invalid' } },
    ])
      expect(claimRequestSchema.safeParse(input).success).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        specialDiseases: null,
        attachments: [
          {
            filename: 'a',
            fileType: 'pdf',
            fileSize: 1,
            uploadDate: '2026-10-07',
            minioObjectName: 'a',
            bucketName: 'claims',
          },
        ],
        documents: [{ dataJsonSchema: '{}', extractedData: { amount: 10 } }],
        docType: { sequence: 1, maxThreshold: 10 },
      }).success
    ).toBe(true)
  })
})
