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
    expect(result.content[0]?.id).toBe('req-1')
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
