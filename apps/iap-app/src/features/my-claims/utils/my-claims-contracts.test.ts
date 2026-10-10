import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP,
  getClaimRequestStatusOptionsIAP,
} from '@features/my-claims/constants/claim-status-constant'
import { getClaimRequestDisplayStatus } from '@features/my-claims/utils/claim-request-display-status'
import { myIapFindTimeStamp } from '@features/my-claims/utils/utils'
import {
  claimRequestSchema,
  myClaimRequestPageRequestSchema,
  pageClaimRequestSchema,
  subInsuredPeopleResponseSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('My Claims reference contracts', () => {
  it('keeps service pagination defaults and strict request boundary', () => {
    expect(myClaimRequestPageRequestSchema.parse({})).toEqual({
      page: 0,
      size: 10,
      filters: {},
    })
    expect(
      myClaimRequestPageRequestSchema.safeParse({ page: -1 }).success
    ).toBe(false)
    expect(myClaimRequestPageRequestSchema.safeParse({ size: 0 }).success).toBe(
      false
    )
    expect(
      myClaimRequestPageRequestSchema.safeParse({ extra: true }).success
    ).toBe(false)
  })
  it('accepts nullish page content and validates full nested responses', () => {
    expect(pageClaimRequestSchema.parse({ content: null }).content).toBeNull()
    expect(pageClaimRequestSchema.parse({}).content).toBeUndefined()
    expect(
      pageClaimRequestSchema.safeParse({
        content: [{ status: 'SENT_TO_BANK' }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({ statusHistory: [{ timestamp: 4 }] })
        .success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({ objections: [{ roleType: 'UNKNOWN' }] })
        .success
    ).toBe(false)
    expect(claimRequestSchema.parse({ extra: true })).toEqual({})
    expect(
      claimRequestSchema.parse({ statusHistory: [{ extra: true }] })
        .statusHistory
    ).toEqual([{ extra: true }])
  })
  it('preserves required lookup fields and strips source-unknown properties', () => {
    const item = {
      id: null,
      nationalCode: '001',
      fullName: 'name',
      extra: true,
    }
    expect(subInsuredPeopleResponseSchema.parse([item])).toEqual([
      { id: null, nationalCode: '001', fullName: 'name' },
    ])
    expect(
      subInsuredPeopleResponseSchema.safeParse([{ id: null }]).success
    ).toBe(false)
  })
  it('keeps status options order and distinct customer labels', () => {
    expect(
      getClaimRequestStatusOptionsIAP((key) => key).map(({ value }) => value)
    ).toEqual([
      'IN_REVIEW',
      'APPROVED',
      'REJECTED',
      'SENT',
      'RETURN',
      'PAID',
      'SENT_TO_BANK',
    ])
    expect(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP.SENT).toBe(
      'claimRequests.status.send_customer'
    )
    expect(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP.DELEGATED).toBe(
      'claimRequests.status.inAssessment'
    )
    expect(
      getClaimRequestDisplayStatus({ status: 'PAID', extPaymentDate: null })
    ).toBe('SENT_TO_BANK')
    expect(
      getClaimRequestDisplayStatus({ status: 'PAID', extPaymentDate: '' })
    ).toBe('PAID')
  })
  it('keeps first original occurrence without mutating source history', () => {
    const history = [
      { status: 'APPROVED' as const, timestamp: 'first' },
      { status: 'APPROVED' as const, timestamp: 'last' },
    ]
    expect(myIapFindTimeStamp(history)).toEqual({
      statusApproved: 'first',
      statusPaid: null,
      statusReturn: null,
    })
    expect(history[0]?.timestamp).toBe('first')
    expect(
      myIapFindTimeStamp([{ status: 'RETURN' }]).statusReturn
    ).toBeUndefined()
  })
})
