import {
  claimRequestSchema,
  registeryAgentAddObjectionRequestSchema,
} from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { agentClaimRequestService } from './agent-claim-request-service'

const mockApiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({
  getApiClient: () => mockApiClient,
}))

describe('agentClaimRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls getPage with default params and transforms filters', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: {
        content: [{ id: 'req-1', amount: 1000 }],
        totalPages: 1,
        totalElements: 1,
      },
    })

    const result = await agentClaimRequestService.getPage({
      page: 0,
      size: 20,
      filters: { status: 'IN_ASSESSMENT' },
    })

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/claim-request-registery-agent/claim-requests/page-full',
      {
        params: {
          page: 0,
          size: 20,
          status: 'IN_ASSESSMENT',
        },
        signal: undefined,
      }
    )
    expect(result.content).toHaveLength(1)
    expect(result.content?.[0]?.id).toBe('req-1')
  })

  it('calls exportPageLiteExcel with correct params and responseType', async () => {
    const mockBlob = new Blob(['test'])
    mockApiClient.get.mockResolvedValueOnce({ data: mockBlob })

    const result = await agentClaimRequestService.exportPageLiteExcel({
      filters: { status: 'APPROVED' },
    })

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/claim-request-registery-agent/claim-requests/page-lite/excel',
      {
        params: { status: 'APPROVED' },
        responseType: 'blob',
        signal: undefined,
      }
    )
    expect(result).toBe(mockBlob)
  })

  it('calls delete with claimRequestId in path', async () => {
    mockApiClient.delete.mockResolvedValueOnce({ data: null })

    await agentClaimRequestService.delete('req-123')

    expect(mockApiClient.delete).toHaveBeenCalledWith(
      '/claim-request-registery-agent/claim-requests/req-123'
    )
  })

  it('calls refreshPolicyDetails with id in path', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: { id: 'req-123', extPolicyId: 555 },
    })

    const result =
      await agentClaimRequestService.refreshPolicyDetails('req-123')

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/claim-requests/req-123/policy-details'
    )
    expect(result.id).toBe('req-123')
  })

  it('calls getById with id in path', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: { id: 'req-456' },
    })

    const result = await agentClaimRequestService.getById('req-456')

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/claim-request-registery-agent/claim-requests/req-456',
      { signal: undefined }
    )
    expect(result.id).toBe('req-456')
  })

  it('calls create with payload', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: { id: 'req-new', extPolicyId: 123 },
    })

    const result = await agentClaimRequestService.create({
      selectedUserId: 'user-1',
      claimRequest: { extPolicyId: 123 },
    })

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/claim-request-registery-agent/claim-requests',
      {
        selectedUserId: 'user-1',
        claimRequest: { extPolicyId: 123 },
      }
    )
    expect(result.id).toBe('req-new')
  })

  it('calls getSubInsuredPeople with policyId and username', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: [{ id: 10, nationalCode: '1234567890', fullName: 'Ali' }],
    })

    const result = await agentClaimRequestService.getSubInsuredPeople(
      101,
      'user-ali'
    )

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/claim-request-registery-agent/sub-insured-people/101/user-ali',
      { signal: undefined }
    )
    expect(result).toHaveLength(1)
    expect(result[0]?.nationalCode).toBe('1234567890')
  })

  it('calls inquiry with username query parameter', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: { selectedUser: null, policies: [] },
    })

    const result = await agentClaimRequestService.inquiry({
      username: 'user-test',
    })

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/claim-request-registery-agent/inquery',
      {
        params: { username: 'user-test' },
        signal: undefined,
      }
    )
    expect(result.policies).toEqual([])
  })
})

describe('agent claim detail contracts', () => {
  const attachment = {
    filename: 'receipt.pdf',
    fileType: 'application/pdf',
    fileSize: 10,
    uploadDate: '2026-01-01',
    minioObjectName: 'receipt',
    bucketName: 'claims',
    metadata: null,
    customAttachmentField: 'retained',
  }

  it('forwards the detail AbortSignal and rejects invalid nested responses', async () => {
    const signal = new AbortController().signal
    mockApiClient.get.mockResolvedValueOnce({
      data: { id: 'detail', attachments: [attachment] },
    })
    await agentClaimRequestService.getById('detail', { signal })
    expect(mockApiClient.get).toHaveBeenLastCalledWith(
      '/claim-request-registery-agent/claim-requests/detail',
      { signal }
    )
    mockApiClient.get.mockResolvedValueOnce({
      data: { objections: [{ roleType: 'UNKNOWN' }] },
    })
    await expect(agentClaimRequestService.getById('detail')).rejects.toThrow()
  })

  it('preserves nested loose metadata and strips unknown top-level fields', () => {
    const result = claimRequestSchema.parse({
      unexpected: 'stripped',
      attachments: [attachment],
      documents: [
        { extractedData: { arbitrary: [1, null] }, customDocumentField: true },
      ],
      objections: [{ id: 'objection', roleType: 'ENDUSER', description: null }],
      docType: { docType: 'receipt', customDocTypeField: true },
    })
    expect(result).not.toHaveProperty('unexpected')
    expect(result.attachments?.[0]).toHaveProperty(
      'customAttachmentField',
      'retained'
    )
    expect(result.documents?.[0]).toHaveProperty('customDocumentField', true)
    expect(result.objections?.[0]).toHaveProperty('id', 'objection')
    expect(result.docType).toHaveProperty('customDocTypeField', true)
    expect(
      claimRequestSchema.safeParse({
        attachments: [{ filename: 'incomplete' }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        documents: [{ extractedData: 'invalid' }],
      }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({ objections: [{ createdAt: 10 }] }).success
    ).toBe(false)
    expect(
      claimRequestSchema.safeParse({
        attachments: null,
        documents: null,
        objections: null,
      }).success
    ).toBe(true)
  })

  it('keeps source objection acceptance, issue order and unknown output', () => {
    expect(
      registeryAgentAddObjectionRequestSchema.parse({
        claimRequestId: '',
        description: '',
        claimRequestStatus: '',
        isCheat: 'Y',
        sourceUnknown: { preserved: true },
      })
    ).toEqual({
      claimRequestId: '',
      description: '',
      claimRequestStatus: '',
      isCheat: 'Y',
      sourceUnknown: { preserved: true },
    })
    const result = registeryAgentAddObjectionRequestSchema.safeParse({
      claimRequestId: null,
      description: null,
      claimRequestStatus: null,
      attachments: null,
      isCheat: 'UNKNOWN',
      extra: true,
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(
        result.error.issues.map(({ code, path, message }) => ({
          code,
          path,
          message,
        }))
      ).toEqual([
        {
          code: 'invalid_type',
          path: ['claimRequestId'],
          message: 'Invalid input: expected string, received null',
        },
        {
          code: 'invalid_type',
          path: ['description'],
          message: 'Invalid input: expected string, received null',
        },
        {
          code: 'invalid_type',
          path: ['claimRequestStatus'],
          message: 'Invalid input: expected string, received null',
        },
        {
          code: 'invalid_type',
          path: ['attachments'],
          message: 'Invalid input: expected array, received null',
        },
        {
          code: 'invalid_value',
          path: ['isCheat'],
          message: 'Invalid option: expected one of "Y"|"N"',
        },
      ])
  })

  it('preserves every nested source object mode', () => {
    const result = claimRequestSchema.parse({
      externalDoctor: { unknown: true },
      statusHistory: [{ unknown: true }],
      assignmentHistory: [{ unknown: true }],
      subInsuredPeople: [{ unknown: true }],
      duplicates: [{ unknown: true, duplicatesDetail: [{ unknown: true }] }],
      aiAssessmentResults: [{ unknown: true }],
      expert_info_addon: { arbitrary: undefined },
      documents: [{ extractedData: { arbitrary: undefined } }],
    })
    expect(result.externalDoctor).toEqual({ unknown: true })
    expect(result.statusHistory).toEqual([{ unknown: true }])
    expect(result.assignmentHistory).toEqual([{ unknown: true }])
    expect(result.subInsuredPeople).toEqual([{}])
    expect(result.duplicates).toEqual([{ duplicatesDetail: [{}] }])
    expect(result.aiAssessmentResults).toEqual([{}])
    expect(result.expert_info_addon).toEqual({ arbitrary: undefined })
    expect(result.documents?.[0]?.extractedData).toEqual({
      arbitrary: undefined,
    })
  })

  it('posts the reference objection payload and validates its response', async () => {
    const payload = {
      claimRequestId: 'detail',
      description: 'More documents',
      attachments: [attachment],
      claimRequestStatus: 'IN_ASSESSMENT',
    }
    mockApiClient.post.mockResolvedValueOnce({
      data: { id: 'detail', status: 'IN_ASSESSMENT' },
    })
    await expect(
      agentClaimRequestService.submitObjection(payload)
    ).resolves.toMatchObject({ id: 'detail' })
    expect(mockApiClient.post).toHaveBeenLastCalledWith(
      '/claim-request-registery-agent/claim-requests/objections',
      payload
    )
    expect(
      registeryAgentAddObjectionRequestSchema.safeParse({
        ...payload,
        unexpected: true,
      }).success
    ).toBe(true)
    expect(
      registeryAgentAddObjectionRequestSchema.safeParse({
        ...payload,
        attachments: null,
      }).success
    ).toBe(false)
    mockApiClient.post.mockResolvedValueOnce({ data: { status: 'UNKNOWN' } })
    await expect(
      agentClaimRequestService.submitObjection(payload)
    ).rejects.toThrow()
  })
})
