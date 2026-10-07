import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { coreAiService } from '@features/claim-requests/services/core-ai-service'
import {
  claimRequestSchema,
  coreAiDataExtractionRequestSchema,
} from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('claimRequestService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads sub-insured people with cancellation and validates source fields', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({
      data: [
        {
          id: 1,
          nationalCode: '123',
          fullName: 'Name',
          isForeign: 'N',
          extra: true,
        },
      ],
    })
    await expect(
      claimRequestService.getSubInsuredPeople('claim-1', { signal })
    ).resolves.toEqual([
      {
        id: 1,
        nationalCode: '123',
        fullName: 'Name',
        isForeign: 'N',
        extra: true,
      },
    ])
    expect(apiClient.get).toHaveBeenCalledWith(
      '/claim-requests/claim-1/sub-insured-people',
      { signal }
    )
    apiClient.get.mockResolvedValue({ data: [{ id: 'invalid' }] })
    await expect(
      claimRequestService.getSubInsuredPeople('claim-1')
    ).rejects.toThrow()
  })

  it('uses reference list and mutation contracts', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
    apiClient.delete.mockResolvedValue({ data: {} })
    apiClient.patch.mockResolvedValue({ data: {} })

    await claimRequestService.findPage({
      filters: { status: 'IN_ASSESSMENT', tags: ['priority'] },
      page: 1,
      signal,
      size: 30,
    })
    await claimRequestService.assignToMe('claim-1')
    await claimRequestService.findById('claim-1', signal)
    await claimRequestService.assignToMeWithStatus('claim-1', {
      claimRequestStatus: 'APPROVED',
    })
    await claimRequestService.bulkDelete(['claim-1'])
    await claimRequestService.submitBulkStatusChange({
      claimRequestId: ['claim-1'],
      claimRequestStatus: 'APPROVED',
    })
    await claimRequestService.assignNewToMe({ extPolicyId: 'policy-1' })
    await claimRequestService.delete('claim-1')
    apiClient.get.mockResolvedValueOnce({ data: new Blob(['excel']) })
    await claimRequestService.exportPageLiteExcel({
      filters: { status: 'APPROVED' },
    })
    await claimRequestService.generateAndSendBulk(['claim-1'])
    await claimRequestService.inquiryFanavaranBulk(['claim-1'])
    await claimRequestService.startBulkCoreAiDataExtraction([
      { claimRequestId: 'claim-1', initiatedBy: 'expert', workflowId: 'flow' },
    ])
    await claimRequestService.sendStatusChangeNotification('claim-1')
    await claimRequestService.updateDocType({
      claimRequestId: 'claim-1',
      newDocType: 'INVOICE',
    })
    await claimRequestService.updateDocuments({
      body: {
        documents: [{ extractedData: { approved: true }, id: 'document-1' }],
      },
      path: { id: 'claim-1' },
    })

    expect(apiClient.get).toHaveBeenCalledWith('/claim-requests/page-lite', {
      params: {
        page: 1,
        size: 30,
        status: 'IN_ASSESSMENT',
        tags__in: 'priority',
      },
      signal,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      '/claim-requests/claim-1/assignments/me'
    )
    expect(apiClient.patch).toHaveBeenCalledWith('/claim-requests/claim-1', {
      documents: [{ extractedData: { approved: true }, id: 'document-1' }],
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      '/claim-requests/claim-1/assignments/me/status',
      { claimRequestStatus: 'APPROVED' }
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/claim-requests/bulk-delete',
      { data: ['claim-1'] }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      3,
      '/claim-requests/objections-bulk',
      { claimRequestId: ['claim-1'], claimRequestStatus: 'APPROVED' }
    )
    expect(apiClient.get).toHaveBeenCalledWith('/claim-requests/claim-1', {
      signal,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      4,
      '/claim-requests/assignments/me/new',
      undefined,
      { params: { extPolicyId: 'policy-1' } }
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/claim-requests/claim-1')
    expect(apiClient.get).toHaveBeenCalledWith(
      '/claim-requests/page-lite/excel',
      {
        params: { status: 'APPROVED' },
        responseType: 'blob',
        signal: undefined,
      }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      5,
      '/outpatient-doc-acceptances/generate-and-send-bulk',
      undefined,
      { params: { claimRequestIds: ['claim-1'] } }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      6,
      '/claim-requests/policy-details/bulk',
      { claimRequestIds: ['claim-1'] }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      7,
      '/core-ai/workflows/data-extraction/start/bulk',
      [{ claimRequestId: 'claim-1', initiatedBy: 'expert', workflowId: 'flow' }]
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      8,
      '/claim-requests/claim-1/status-change-notifications'
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      9,
      '/claim-requests/doc-type',
      { claimRequestId: 'claim-1', newDocType: 'INVOICE' }
    )
  })

  it('validates required request values before transport', async () => {
    await expect(
      claimRequestService.findPage({
        filters: {},
        page: -1,
        size: 20,
      })
    ).rejects.toThrow()
    await expect(
      claimRequestService.bulkDelete([123 as unknown as string])
    ).rejects.toThrow()
    await expect(
      claimRequestService.assignToMe(123 as unknown as string)
    ).rejects.toThrow()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })
  it('matches reference response stripping, nested retention and issue order', () => {
    const parsed = claimRequestSchema.parse({
      id: '',
      extra: true,
      externalDoctor: { city: '', extra: true },
      aiAssessmentResults: [{ id: '', extra: true }],
      duplicates: [
        { id: '', extra: true, duplicatesDetail: [{ extra: true }] },
      ],
      docType: { id: '', extra: true },
      subInsuredPeople: [{ id: 0, extra: true }],
    })
    expect(parsed).toEqual({
      id: '',
      externalDoctor: { city: '', extra: true },
      aiAssessmentResults: [{ id: '' }],
      duplicates: [{ id: '', duplicatesDetail: [{}] }],
      docType: { id: '', extra: true },
      subInsuredPeople: [{ id: 0 }],
    })
    const invalid = claimRequestSchema.safeParse({
      id: 1,
      submitDate: 1,
      amount: '1',
    })
    expect(invalid.success).toBe(false)
    if (!invalid.success)
      expect(invalid.error.issues.map((issue) => issue.path)).toEqual([
        ['id'],
        ['submitDate'],
        ['amount'],
      ])
    expect(() => claimRequestSchema.parse({ attachments: [{}] })).toThrow()
    expect(
      coreAiDataExtractionRequestSchema.parse({
        claimRequestId: ' x ',
        workflowId: ' f ',
        initiatedBy: ' u ',
      })
    ).toEqual({ claimRequestId: ' x ', workflowId: 'f', initiatedBy: ' u ' })
  })

  it('offers canonical source methods and validates Core AI response while trimming service inputs', async () => {
    expect(claimRequestService.getPageLite).toBe(claimRequestService.findPage)
    expect(claimRequestService.submitObjectionsBulk).toBe(
      claimRequestService.submitBulkStatusChange
    )
    apiClient.post.mockResolvedValue({
      data: [{ workflowId: 'f', additional: true }],
    })
    expect(
      await coreAiService.bulkStartDataExtractionWorkflow([
        { claimRequestId: ' x ', workflowId: ' f ', initiatedBy: ' u ' },
      ])
    ).toEqual([{ workflowId: 'f', additional: true }])
    expect(apiClient.post).toHaveBeenCalledWith(
      '/core-ai/workflows/data-extraction/start/bulk',
      [{ claimRequestId: 'x', workflowId: 'f', initiatedBy: 'u' }]
    )
    apiClient.post.mockResolvedValue({ data: [] })
    await coreAiService.bulkStartDataExtractionWorkflow([])
    await claimRequestService.bulkDelete([])
    apiClient.post.mockResolvedValue({ data: [{ workflowId: 1 }] })
    await expect(
      coreAiService.bulkStartDataExtractionWorkflow([])
    ).rejects.toThrow()
  })
})
