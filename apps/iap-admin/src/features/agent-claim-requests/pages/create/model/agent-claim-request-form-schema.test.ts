import { describe, expect, it } from 'vitest'

import {
  agentClaimRequestFormSchema,
  defaultAgentClaimRequestFormValues,
} from './agent-claim-request-form-schema'

const t = ((key: string) => key) as unknown as import('i18next').TFunction

describe('agentClaimRequestFormSchema', () => {
  const schema = agentClaimRequestFormSchema(t)

  const validAttachment = {
    filename: 'test.png',
    fileType: 'image/png',
    fileSize: 1024,
    uploadDate: '2026-10-10T10:00:00Z',
    minioObjectName: 'obj-123',
    bucketName: 'claims',
  }

  const validData = {
    inquiryNationalCode: '0123456789',
    submitDate: new Date('2026-10-10'),
    amount: '500000',
    attachments: [validAttachment],
    docType: {
      id: 'doc-1',
      docType: 'Hospitalization',
      docTypeCode: 'HOSP',
      documentGuide: 'Guide text',
    },
    extNationalCode: {
      id: 1,
      nationalCode: '0123456789',
      fullName: 'Ali Rezaei',
    },
    extPolicyId: 101,
  }

  it('validates correct form data successfully', () => {
    const result = schema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails when inquiryNationalCode is not exactly 10 digits', () => {
    const shortResult = schema.safeParse({
      ...validData,
      inquiryNationalCode: '12345',
    })
    expect(shortResult.success).toBe(false)
    if (!shortResult.success) {
      expect(shortResult.error.issues[0].message).toBe(
        'agent.claimRequests.create.validation.inquiryNationalCodeLength'
      )
    }

    const longResult = schema.safeParse({
      ...validData,
      inquiryNationalCode: '012345678901',
    })
    expect(longResult.success).toBe(false)
  })

  it('fails when submitDate is missing or not a Date', () => {
    const result = schema.safeParse({
      ...validData,
      submitDate: undefined,
    })
    expect(result.success).toBe(false)
  })

  it('fails when amount is empty', () => {
    const result = schema.safeParse({
      ...validData,
      amount: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'claimRequests.validation.amountRequired'
      )
    }
  })

  it('fails when attachments is empty array', () => {
    const result = schema.safeParse({
      ...validData,
      attachments: [],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'claimRequests.validation.attachmentsRequired'
      )
    }
  })

  it('fails when docType.id is empty', () => {
    const result = schema.safeParse({
      ...validData,
      docType: {
        id: '',
        docType: '',
        docTypeCode: '',
        documentGuide: '',
      },
    })
    expect(result.success).toBe(false)
  })

  it('fails when extNationalCode has no nationalCode', () => {
    const result = schema.safeParse({
      ...validData,
      extNationalCode: {
        id: 0,
        nationalCode: '',
        fullName: '',
      },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'claimRequests.validation.subInsuredPersonRequired'
      )
    }
  })

  it('fails when extPolicyId is 0 or negative', () => {
    const result = schema.safeParse({
      ...validData,
      extPolicyId: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'claimRequests.validation.insurancePolicyRequired'
      )
    }
  })

  it('has valid defaultAgentClaimRequestFormValues structure', () => {
    expect(defaultAgentClaimRequestFormValues.inquiryNationalCode).toBe('')
    expect(defaultAgentClaimRequestFormValues.extPolicyId).toBe(0)
    expect(defaultAgentClaimRequestFormValues.attachments).toEqual([])
  })
})
