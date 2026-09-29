import {
  adminDocTypeSchema,
  docTypeCodesSchema,
  docTypeFormSchema,
  docTypePageRequestSchema,
  docTypePageSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('document-type contracts', () => {
  it('accepts the reference document-type fixture and optional page metadata', () => {
    const docType = adminDocTypeSchema.parse({
      dataJsonSchema: '{"type":"object"}',
      docType: 'Invoice',
      docTypeCode: 'INV',
      prompt: 'Extract invoice data',
    })

    expect(docTypePageSchema.parse({ content: [docType] }).content).toEqual([
      docType,
    ])
  })

  it('uses the shared page defaults and retains reference form validation', () => {
    expect(docTypePageRequestSchema.parse({})).toMatchObject({
      filters: {},
      page: 0,
      size: 20,
    })
    expect(
      docTypeFormSchema.safeParse({
        dataJsonSchema: '{"type":"object"}',
        docType: 'Invoice',
        docTypeCode: 'INV',
        prompt: 'Extract invoice data',
      }).success
    ).toBe(true)
  })

  it('shares document-type codes across API contracts without creating an enum', () => {
    expect(docTypeCodesSchema.parse(['INVOICE', 'MEDICAL_NOTE'])).toEqual([
      'INVOICE',
      'MEDICAL_NOTE',
    ])
  })
})
