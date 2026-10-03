import { pageOutpatientDocAcceptanceSchema } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

const validPage = {
  content: [
    {
      id: 'acceptance-1',
      outpatientClaim: {
        claimNo: 101,
        issuance: { dmgCases: [{ assessmentItemId: 'item-1' }] },
      },
      wsStatus: 'DONE',
    },
  ],
  empty: false,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 1,
  size: 40,
  totalElements: 1,
  totalPages: 1,
}

describe('outpatient document acceptance response contract', () => {
  it('retains the mounted nested response contract from the reference', () => {
    expect(pageOutpatientDocAcceptanceSchema.parse(validPage)).toMatchObject(
      validPage
    )
  })

  it('rejects incomplete pagination metadata', () => {
    const invalidPage = { ...validPage, totalPages: undefined }

    expect(
      pageOutpatientDocAcceptanceSchema.safeParse(invalidPage).success
    ).toBe(false)
  })
})
