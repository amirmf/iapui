import { claimRequestObjectionFormSchema } from '@features/claim-requests/pages/claim-request-management/model/claim-request-objection-form-schema'
import { hasDuplicatedAssessmentItem } from '@features/claim-requests/pages/claim-request-management/model/objection-approval-guards'
import type { AssessmentItem } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

const item = (code?: string, toothNumbers?: number[], toothNumber?: number) =>
  ({
    damageCode: code ? { code } : undefined,
    toothNumbers,
    toothNumber,
  }) as AssessmentItem

describe('claim objection source contracts', () => {
  it('requires status, allows whitespace descriptions and optional cheat, and requires nonapproved descriptions', () => {
    const schema = claimRequestObjectionFormSchema((key) => key)
    expect(schema.safeParse({ description: '' }).success).toBe(false)
    expect(
      schema.safeParse({ claimRequestStatus: 'APPROVED', description: null })
        .success
    ).toBe(true)
    expect(
      schema.safeParse({ claimRequestStatus: 'RETURN', description: ' ' })
        .success
    ).toBe(true)
    const invalid = schema.safeParse({
      claimRequestStatus: 'REJECTED',
      description: '',
    })
    expect(invalid.success).toBe(false)
    if (!invalid.success)
      expect(invalid.error.issues[0].message).toBe(
        'claimRequests.validation.description'
      )
  })
  it('matches duplicate damage code guards for overlapping and absent tooth numbers', () => {
    expect(hasDuplicatedAssessmentItem([item('a', [1]), item('a', [2])])).toBe(
      false
    )
    expect(
      hasDuplicatedAssessmentItem([item('a', [1]), item('a', [], 1)])
    ).toBe(true)
    expect(hasDuplicatedAssessmentItem([item('a'), item('a', [2])])).toBe(true)
    expect(
      hasDuplicatedAssessmentItem([item(undefined), item(undefined)])
    ).toBe(false)
    expect(hasDuplicatedAssessmentItem([item('a', [1]), item('b', [1])])).toBe(
      false
    )
  })
})
