import {
  medicalCenterInvoiceListRequestSchema,
  medicalCenterInvoiceSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

import { medicalCenterInvoiceKeys } from './medical-center-invoice-query'

describe('medical center invoice contracts', () => {
  it('applies reference list defaults and preserves filters', () => {
    expect(
      medicalCenterInvoiceListRequestSchema.parse({
        filters: { documentNumber: '42' },
      })
    ).toEqual({ page: 0, size: 30, filters: { documentNumber: '42' } })
  })

  it('rejects an invoice record without records', () => {
    expect(medicalCenterInvoiceSchema.safeParse({ id: '1' }).success).toBe(
      false
    )
  })

  it('keeps list and detail keys distinct', () => {
    const request = { page: 0, size: 30, filters: {} }
    expect(medicalCenterInvoiceKeys.list(request)).toEqual([
      'medical-center-invoices',
      'list',
      request,
    ])
    expect(medicalCenterInvoiceKeys.detail('abc/1')).toEqual([
      'medical-center-invoices',
      'detail',
      'abc/1',
    ])
  })
})
