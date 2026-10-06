import {
  dmgCaseFormSchema,
  dmgCaseMutationRequestSchema,
  dmgCaseSchema,
  issuanceSchema,
  outpatientDocAcceptanceFormSchema,
  outpatientDocAcceptanceStatusEnum,
  outpatientDocAcceptanceStatusSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('reference outpatient contract semantics', () => {
  it('keeps canonical enum exports compatible with existing consumers', () => {
    expect(outpatientDocAcceptanceStatusEnum).toBe(
      outpatientDocAcceptanceStatusSchema
    )
    expect(outpatientDocAcceptanceStatusEnum.options).toEqual([
      'SUBMIT',
      'SENT_TO_SERVER',
      'REJECT',
      'FAILED',
      'DELETED',
      'SUCCESS',
    ])
  })
  it('accepts string numeric damage inputs, trims them and rejects numeric values', () => {
    expect(
      dmgCaseFormSchema.parse({
        requestedAmount: ' 42 ',
        approvedAmount: '',
        insuredPersonId: null,
        serviceDate: ' date ',
        unknown: 1,
      })
    ).toEqual({
      requestedAmount: '42',
      approvedAmount: undefined,
      insuredPersonId: undefined,
      serviceDate: 'date',
    })
    expect(dmgCaseFormSchema.safeParse({ requestedAmount: 42 }).success).toBe(
      false
    )
    expect(dmgCaseFormSchema.safeParse({ serviceDate: null }).success).toBe(
      false
    )
  })
  it('strips form extras while retaining response extras and nullable fields', () => {
    expect(
      outpatientDocAcceptanceFormSchema.parse({
        letterNo: ' abc ',
        id: 'ignored',
      })
    ).toEqual({ letterNo: 'abc' })
    expect(dmgCaseSchema.parse({ requestedAmount: null, extra: 1 })).toEqual({
      requestedAmount: null,
      extra: 1,
    })
  })
  it('validates mapped transport bodies separately with strict numeric fields', () => {
    expect(
      dmgCaseMutationRequestSchema.safeParse({ requestedAmount: '42' }).success
    ).toBe(false)
    expect(
      dmgCaseMutationRequestSchema.safeParse({
        requestedAmount: 42,
        inventedField: 1,
      }).success
    ).toBe(false)
    expect(
      dmgCaseMutationRequestSchema.parse({
        requestedAmount: 42,
        docAcceptanceId: 17,
      })
    ).toEqual({ requestedAmount: 42, docAcceptanceId: 17 })
  })
  it('validates nested issuance and damage responses recursively', () => {
    expect(
      issuanceSchema.safeParse({
        afterInqueryResult: { dmgCases: [{ approvedAmount: '42' }] },
      }).success
    ).toBe(false)
    expect(
      issuanceSchema.parse({
        afterInqueryResult: { dmgCases: [{ approvedAmount: 42 }] },
      })
    ).toEqual({ afterInqueryResult: { dmgCases: [{ approvedAmount: 42 }] } })
  })
})
