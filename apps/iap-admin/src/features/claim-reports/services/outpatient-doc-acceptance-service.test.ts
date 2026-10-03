import { beforeEach, describe, expect, it, vi } from 'vitest'

import { outpatientDocAcceptanceService } from './outpatient-doc-acceptance-service'

const apiClient = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('outpatientDocAcceptanceService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference list and report-export contracts', async () => {
    const signal = new AbortController().signal
    const blob = new Blob(['report'])
    apiClient.get
      .mockResolvedValueOnce({
        data: {
          content: [],
          empty: true,
          first: true,
          last: true,
          number: 0,
          numberOfElements: 0,
          size: 30,
          totalElements: 0,
          totalPages: 0,
        },
      })
      .mockResolvedValueOnce({ data: blob })
      .mockResolvedValueOnce({ data: blob })

    await outpatientDocAcceptanceService.getPage({
      filters: { direction: 'desc', sort: 'exId', status: ['SUCCESS'] },
      page: 1,
      signal,
      size: 30,
    })
    await outpatientDocAcceptanceService.exportReport({
      outpatientDocAcceptanceId: 'acceptance-1',
    })
    await outpatientDocAcceptanceService.exportPdfReport({
      outpatientDocAcceptanceId: 'acceptance-1',
    })

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/outpatient-doc-acceptances/page',
      {
        params: {
          direction: 'desc',
          page: 1,
          size: 30,
          sort: 'exId',
          status__in: 'SUCCESS',
        },
        signal,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      '/outpatient-doc-acceptances/export-report',
      {
        params: { outpatientDocAcceptanceId: 'acceptance-1' },
        responseType: 'blob',
        signal: undefined,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      3,
      '/outpatient-doc-acceptances/export-report/pdf',
      {
        params: { outpatientDocAcceptanceId: 'acceptance-1' },
        responseType: 'blob',
        signal: undefined,
      }
    )
  })

  it('rejects invalid request data before transport', async () => {
    await expect(
      outpatientDocAcceptanceService.getPage({
        filters: {},
        page: -1,
        size: 20,
      })
    ).rejects.toThrow()
    await expect(
      outpatientDocAcceptanceService.exportReport({
        outpatientDocAcceptanceId: '',
      })
    ).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
  })
})
