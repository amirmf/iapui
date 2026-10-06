import { beforeEach, describe, expect, it, vi } from 'vitest'

import { agreementPartyApplService } from './agreement-party-appl-service'

const agreementId = '550e8400-e29b-41d4-a716-446655440000'
const userAccountId = '550e8400-e29b-41d4-a716-446655440001'
const partyApplId = '550e8400-e29b-41d4-a716-446655440002'
const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('agreementPartyApplService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the reference method names and singular array-filter arguments', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: [] })
    apiClient.put.mockResolvedValue({ data: [] })
    await agreementPartyApplService.getPartyApplicationsPageFull({
      agreementId: [agreementId],
      userAccountId: [userAccountId],
    })
    expect(apiClient.get).toHaveBeenLastCalledWith(
      '/agreement-party-appls/page-full',
      {
        params: {
          agreementId__in: agreementId,
          userAccountId__in: userAccountId,
          page: 0,
          size: 30,
        },
        signal: undefined,
      }
    )
    await agreementPartyApplService.getPartyApplications({ agreementId })
    expect(apiClient.get).toHaveBeenLastCalledWith(
      '/agreement-party-appls/page-full',
      {
        params: { agreementId, page: 0, size: 30 },
        signal: undefined,
      }
    )
    await agreementPartyApplService.getPartyApplicationsPage({ agreementId })
    expect(apiClient.get).toHaveBeenLastCalledWith(
      '/agreement-party-appls/page',
      {
        params: { agreementId, page: 0, size: 30 },
        signal: undefined,
      }
    )
    await agreementPartyApplService.bulkCreatePartyApplicationsWithRole({
      agreementIds: [agreementId],
      userAccountIds: [userAccountId],
    })
    expect(apiClient.post).toHaveBeenLastCalledWith(
      '/agreement-party-appls/bulk-create-with-role',
      { agreementIds: [agreementId], userAccountIds: [userAccountId] }
    )
    await agreementPartyApplService.softDeletePartyApplicationBulk([
      partyApplId,
    ])
    expect(apiClient.put).toHaveBeenLastCalledWith(
      '/agreement-party-appls/soft-delete',
      [partyApplId],
      { params: {} }
    )
    await agreementPartyApplService.bulkDeletePartyApplication([partyApplId])
    expect(apiClient.delete).toHaveBeenLastCalledWith(
      '/agreement-party-appls/bulk-delete',
      { data: [partyApplId] }
    )
  })

  it('uses the party-application endpoints with selected agreement IDs in query params', async () => {
    const signal = new AbortController().signal
    const payload = {
      agreementIds: [agreementId],
      docTypeCodes: ['INVOICE'],
      role: 'ASSESSMENT_USER' as const,
      userAccountIds: [userAccountId],
    }
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: [{ id: partyApplId }] })
    apiClient.put.mockResolvedValue({ data: [{ id: partyApplId }] })

    await agreementPartyApplService.getPage({
      agreementIds: [agreementId],
      filters: { role: ['ASSESSMENT_USER'], userAccountId: userAccountId },
      page: 1,
      signal,
      size: 10,
    })
    await agreementPartyApplService.bulkCreateWithRole(payload)
    await agreementPartyApplService.softDeleteBulk([partyApplId], '2026-12-31')
    await agreementPartyApplService.bulkDelete([partyApplId])

    expect(apiClient.get).toHaveBeenCalledWith(
      '/agreement-party-appls/page-full',
      {
        params: {
          agreementId__in: agreementId,
          page: 1,
          role__in: 'ASSESSMENT_USER',
          size: 10,
          userAccountId,
        },
        signal,
      }
    )
    expect(apiClient.post).toHaveBeenCalledWith(
      '/agreement-party-appls/bulk-create-with-role',
      payload
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/agreement-party-appls/soft-delete',
      [partyApplId],
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/agreement-party-appls/bulk-delete',
      { data: [partyApplId] }
    )
  })

  it('rejects invalid party-application requests before transport', async () => {
    await expect(
      agreementPartyApplService.softDelete('not-a-uuid')
    ).rejects.toThrow()
    await expect(
      agreementPartyApplService.bulkCreateWithRole({
        agreementIds: [],
        userAccountIds: [userAccountId],
      })
    ).rejects.toThrow()
    await expect(agreementPartyApplService.softDeleteBulk([])).rejects.toThrow()
    await expect(agreementPartyApplService.bulkDelete([])).rejects.toThrow()

    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
  })

  it('rejects invalid party-application responses', async () => {
    apiClient.post.mockResolvedValue({ data: [{ id: 'not-a-uuid' }] })

    await expect(
      agreementPartyApplService.bulkCreateWithRole({
        agreementIds: [agreementId],
        userAccountIds: [userAccountId],
      })
    ).rejects.toThrow()
  })

  it('preserves reference user-account selection filters and bulk-create payload', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: [] })
    await agreementPartyApplService.getPage({
      agreementIds: [agreementId],
      userAccountIds: [userAccountId],
    })
    expect(apiClient.get).toHaveBeenCalledWith(
      '/agreement-party-appls/page-full',
      {
        params: {
          agreementId__in: agreementId,
          userAccountId__in: userAccountId,
          page: 0,
          size: 30,
        },
        signal: undefined,
      }
    )
    const input = {
      agreementIds: [agreementId],
      userAccountIds: [userAccountId],
      docTypeCodes: [],
    }
    await agreementPartyApplService.bulkCreate(input)
    expect(apiClient.post).toHaveBeenCalledWith(
      '/agreement-party-appls/bulk-create',
      input
    )
  })

  it('keeps query identifiers distinct from UUID-validated mutation identifiers', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    await agreementPartyApplService.getPage({
      agreementIds: ['backend-selection'],
      userAccountIds: ['account-selection'],
    })
    expect(apiClient.get).toHaveBeenCalledWith(
      '/agreement-party-appls/page-full',
      {
        params: {
          agreementId__in: 'backend-selection',
          userAccountId__in: 'account-selection',
          page: 0,
          size: 30,
        },
        signal: undefined,
      }
    )
  })

  it('serializes Date-based bulk soft deletion and omits an absent end date', async () => {
    apiClient.put.mockResolvedValue({ data: [] })
    const date = new Date('2026-12-31T00:00:00Z')
    await agreementPartyApplService.softDeleteBulk([partyApplId], date)
    await agreementPartyApplService.softDeleteBulk([partyApplId])
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      '/agreement-party-appls/soft-delete',
      [partyApplId],
      { params: { thruDate: date.toISOString() } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/agreement-party-appls/soft-delete',
      [partyApplId],
      { params: {} }
    )
  })

  it('serializes the reference Date-only single-party soft delete query', async () => {
    const date = new Date('2026-12-31T00:00:00Z')
    apiClient.put.mockResolvedValue({ data: { id: partyApplId } })
    await agreementPartyApplService.softDeletePartyApplication(
      partyApplId,
      date
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      `/agreement-party-appls/soft-delete/${partyApplId}`,
      null,
      { params: { thruDate: date.toISOString() } }
    )
  })

  it('preserves single-party create/update methods, paths and date placement', async () => {
    const fromDate = new Date('2026-01-02T03:04:05Z')
    const form = {
      userAccountId,
      role: 'OWNER' as const,
      fromDate,
      thruDate: null,
    }
    apiClient.post.mockResolvedValue({ data: { id: partyApplId } })
    apiClient.put.mockResolvedValue({ data: { id: partyApplId } })
    await agreementPartyApplService.create(agreementId, form)
    await agreementPartyApplService.update(partyApplId, agreementId, form)
    const body = {
      ...form,
      agreementId,
      fromDate: fromDate.toISOString(),
      thruDate: undefined,
    }
    expect(apiClient.post).toHaveBeenCalledWith('/agreement-party-appls', body)
    expect(apiClient.put).toHaveBeenCalledWith(
      `/agreement-party-appls/${partyApplId}`,
      { ...body, id: partyApplId }
    )
  })
})
