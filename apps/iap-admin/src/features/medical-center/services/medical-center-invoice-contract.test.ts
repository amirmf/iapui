import {
  medicalCenterInvoiceListRequestSchema,
  medicalCenterInvoicePageSchema,
  medicalCenterInvoiceSchema,
  medicalCenterInvoiceUploadSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('reference invoice wire acceptance', () => {
  it('strips unknown request and response keys and permits absent page content', () => {
    expect(
      medicalCenterInvoiceListRequestSchema.parse({ extra: true })
    ).toEqual({ page: 0, size: 30, filters: {} })
    expect(medicalCenterInvoicePageSchema.parse({ extra: true })).toEqual({})
    expect(medicalCenterInvoicePageSchema.parse({ content: [] })).toEqual({
      content: [],
    })
  })
  it('rejects null page content and malformed nested records', () => {
    expect(
      medicalCenterInvoicePageSchema.safeParse({ content: null }).success
    ).toBe(false)
    expect(
      medicalCenterInvoiceSchema.safeParse({ records: [{ amount: -1 }] })
        .success
    ).toBe(false)
    expect(
      medicalCenterInvoiceSchema.safeParse({ records: [], state: 'UNKNOWN' })
        .success
    ).toBe(false)
  })
  it('accepts nullable optional invoice fields and rejects empty upload files', () => {
    expect(medicalCenterInvoiceSchema.parse({ records: [], id: null })).toEqual(
      { records: [], id: null }
    )
    expect(
      medicalCenterInvoiceUploadSchema.safeParse({
        file: new File([], 'empty.pdf'),
      }).success
    ).toBe(false)
    expect(
      medicalCenterInvoiceUploadSchema.safeParse({
        file: new File(['data'], 'invoice.pdf'),
      }).success
    ).toBe(true)
  })
})
