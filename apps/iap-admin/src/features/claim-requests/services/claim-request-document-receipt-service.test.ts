import { exportClaimRequestDocumentReceiptFormSchema } from '@features/claim-requests/model/claim-request-document-receipt-schema'
import { exportDocumentReceipt } from '@features/claim-requests/services/claim-request-document-receipt-service'
import {
  exportClaimRequestDocumentReceiptRequestSchema,
  exportClaimRequestDocumentReceiptResponseSchema,
} from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const get = vi.hoisted(() => vi.fn())
vi.mock('@iap/api-client', () => ({ getApiClient: () => ({ get }) }))

describe('claim request document receipt', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the reference GET query and validates the downloaded Blob', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' })
    const signal = new AbortController().signal
    get.mockResolvedValue({ data: blob })
    await expect(
      exportDocumentReceipt({ extMainNationalCode: ' 123 ' }, { signal })
    ).resolves.toBe(blob)
    expect(get).toHaveBeenCalledWith('/claim-requests/export-report/pdf', {
      params: { extMainNationalCode: '123' },
      responseType: 'blob',
      signal,
    })
    get.mockResolvedValue({ data: 'invalid' })
    await expect(
      exportDocumentReceipt({ extMainNationalCode: '123' })
    ).rejects.toThrow()
  })

  it('rejects blank input before sending and uses the exact translated validation key', async () => {
    await expect(
      exportDocumentReceipt({ extMainNationalCode: ' ' })
    ).rejects.toThrow()
    expect(get).not.toHaveBeenCalled()
    const t = vi.fn(() => 'Required national code')
    const result = exportClaimRequestDocumentReceiptFormSchema(t).safeParse({
      extMainNationalCode: ' ',
    })
    expect(t).toHaveBeenCalledWith(
      'claimRequests.documentReceipt.validation.nationalCodeRequired'
    )
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe('Required national code')
    expect(
      exportClaimRequestDocumentReceiptRequestSchema.safeParse({
        extMainNationalCode: '1',
        extra: true,
      }).success
    ).toBe(false)
    expect(
      exportClaimRequestDocumentReceiptResponseSchema.safeParse({}).success
    ).toBe(false)
  })
})
