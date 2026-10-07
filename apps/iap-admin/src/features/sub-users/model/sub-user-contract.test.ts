import {
  pageSubUserSchema,
  releaseAssignmentsPayloadSchema,
  releaseAssignmentsResponseSchema,
  subUserRoleSchema,
  subUserSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('subUserSchema contracts', () => {
  it('validates subUserRoleSchema', () => {
    expect(subUserRoleSchema.safeParse('ROLE_DOCTOR_USER').success).toBe(true)
    expect(subUserRoleSchema.safeParse('ROLE_INVALID').success).toBe(false)
  })

  it('validates valid subUser payload', () => {
    const valid = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: '0123456789',
      displayName: 'Test User',
      enabled: true,
      roles: ['ROLE_DOCTOR_USER'],
    }
    const result = subUserSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe(valid.id)
      expect(result.data.username).toBe('0123456789')
    }
  })

  it('validates pageSubUserSchema', () => {
    const page = {
      content: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          username: '0123456789',
        },
      ],
      totalElements: 1,
      totalPages: 1,
    }
    const result = pageSubUserSchema.safeParse(page)
    expect(result.success).toBe(true)
  })

  it('validates release assignments payload & response', () => {
    const payloadResult = releaseAssignmentsPayloadSchema.safeParse({
      userId: 'test-user-id',
    })
    expect(payloadResult.success).toBe(true)

    const responseResult = releaseAssignmentsResponseSchema.safeParse({
      releasedCount: 5,
    })
    expect(responseResult.success).toBe(true)
  })
})
