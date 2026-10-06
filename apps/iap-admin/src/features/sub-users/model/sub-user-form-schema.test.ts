import { describe, expect, it } from 'vitest'

import {
  createSubUserPayloadSchema,
  updateSubUserPayloadSchema,
} from './sub-user-form-schema'

describe('sub-user-form-schema', () => {
  const t = (key: string) => key

  const validBase = {
    docTypeCodes: ['DOC_01'],
    mobileNumber: '09123456789',
    partyFname: 'علی',
    partyLname: 'محمدی',
    roles: ['ROLE_ASSESSMENT_USER'],
    username: '1234567890',
  }

  it('validates valid create payload with required password', () => {
    const schema = createSubUserPayloadSchema(t as never)
    const valid = {
      ...validBase,
      password: 'password123',
    }
    const result = schema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects create payload without password', () => {
    const schema = createSubUserPayloadSchema(t as never)
    const result = schema.safeParse(validBase)
    expect(result.success).toBe(false)
  })

  it('allows update payload with empty or omitted password', () => {
    const schema = updateSubUserPayloadSchema(t as never)
    const result = schema.safeParse({ ...validBase, password: '' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid username (not 10 digits)', () => {
    const schema = createSubUserPayloadSchema(t as never)
    const result = schema.safeParse({
      ...validBase,
      password: 'password123',
      username: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('enforces doctor role exclusivity', () => {
    const schema = createSubUserPayloadSchema(t as never)
    const singleDoctor = schema.safeParse({
      ...validBase,
      password: 'password123',
      roles: ['ROLE_DOCTOR_USER'],
    })
    expect(singleDoctor.success).toBe(true)

    const mixedDoctor = schema.safeParse({
      ...validBase,
      password: 'password123',
      roles: ['ROLE_DOCTOR_USER', 'ROLE_ASSESSMENT_USER'],
    })
    expect(mixedDoctor.success).toBe(false)
  })
})
