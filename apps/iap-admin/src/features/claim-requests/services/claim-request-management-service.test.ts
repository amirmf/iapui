import { beforeEach, describe, expect, it, vi } from 'vitest'

import { claimRequestManagementService as service } from './claim-request-management-service'
import { coreAiManagementService } from './core-ai-management-service'
import { fanhubTaminService } from './fanhub-tamin-service'

const api = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn(), post: vi.fn() }))
vi.mock('@iap/api-client', () => ({ getApiClient: () => api }))
describe('management transport contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.post.mockResolvedValue({ data: {} })
    api.patch.mockResolvedValue({ data: {} })
    api.get.mockResolvedValue({ data: { content: [] } })
  })
  it('patches exact source status/date/amount fields and rejects unknown requests', async () => {
    await service.updateClaim('c-1', { status: 'IN_ASSESSMENT' })
    expect(api.patch).toHaveBeenCalledWith('/claim-requests/c-1', {
      status: 'IN_ASSESSMENT',
    })
    await service.updateClaim('c-1', { submitDate: '2026-10-07', amount: 900 })
    expect(api.patch).toHaveBeenLastCalledWith('/claim-requests/c-1', {
      submitDate: '2026-10-07',
      amount: 900,
    })
    await expect(
      service.updateClaim('c-1', { unsupported: true } as never)
    ).rejects.toThrow()
    await expect(
      service.updateClaim('c-1', { status: 'INVALID' } as never)
    ).rejects.toThrow()
  })
  it('preserves body placement for assignments and objections', async () => {
    const assignment = {
      assigneeId: 'd-1',
      description: 'reply',
      claimRequestStatus: 'DELEGATED',
    } as const
    await service.assign('c-1', assignment)
    expect(api.post).toHaveBeenLastCalledWith(
      '/claim-requests/c-1/assignments',
      assignment
    )
    await service.assignToMe('c-1')
    expect(api.post).toHaveBeenLastCalledWith(
      '/claim-requests/c-1/assignments/me'
    )
    await service.assignToMeWithStatus('c-1', {
      claimRequestStatus: 'IN_ASSESSMENT',
    })
    expect(api.post).toHaveBeenLastCalledWith(
      '/claim-requests/c-1/assignments/me/status',
      { claimRequestStatus: 'IN_ASSESSMENT' }
    )
    const objection = {
      claimRequestId: 'c-1',
      description: 'reason',
      claimRequestStatus: 'PAYMENT_RETURN_RESEND',
      isCheat: 'N',
    } as const
    await service.submitObjection(objection)
    expect(api.post).toHaveBeenLastCalledWith(
      '/claim-requests/objections',
      objection
    )
    await expect(
      service.assign('c-1', { ...assignment, extra: true } as never)
    ).rejects.toThrow()
    await expect(
      service.submitObjection({ ...objection, extra: true } as never)
    ).rejects.toThrow()
  })
  it('keeps policy refresh bodyless and serializes history filters at the API boundary', async () => {
    await service.refreshPolicyDetails('c-1')
    expect(api.post).toHaveBeenLastCalledWith(
      '/claim-requests/c-1/policy-details'
    )
    const signal = new AbortController().signal
    await service.getHistory({
      userId: 'u-1',
      page: 2,
      size: 40,
      filters: { status: ['PAID', 'SENT'] },
      signal,
    })
    expect(api.get).toHaveBeenCalledWith('/claim-requests/history/u-1', {
      params: { page: 2, size: 40, status__in: 'PAID,SENT' },
      signal,
    })
    api.get.mockResolvedValue({ data: { content: [{ status: 'INVALID' }] } })
    await expect(service.getHistory({ userId: 'u-1' })).rejects.toThrow()
  })
  it('trims workflow input, preserves response extras and escapes approval workflow id', async () => {
    api.post.mockResolvedValue({
      data: { status: 'NEW_SERVER_STATUS', extra: true },
    })
    await expect(
      coreAiManagementService.startDataExtractionWorkflow({
        claimRequestId: ' c-1 ',
        workflowId: ' c-1 ',
        initiatedBy: ' user ',
      })
    ).resolves.toEqual({ status: 'NEW_SERVER_STATUS', extra: true })
    expect(api.post).toHaveBeenLastCalledWith(
      '/core-ai/workflows/data-extraction/start',
      { claimRequestId: 'c-1', workflowId: 'c-1', initiatedBy: 'user' }
    )
    api.post.mockResolvedValue({ data: undefined })
    await coreAiManagementService.approveDataExtractionWorkflow(' a/b ')
    expect(api.post).toHaveBeenLastCalledWith(
      '/core-ai/workflows/data-extraction/a%2Fb/approve'
    )
  })
  it('keeps all four source-backed prescription mocks without issuing HTTP', async () => {
    const input = { nationalCode: '1234567890', prescriptionDate: '2026-10-07' }
    await fanhubTaminService.inquireDrugPrescriptions(input)
    await fanhubTaminService.inquireParaClinicPrescriptions(input)
    await fanhubTaminService.inquireOfficeServices(input)
    await fanhubTaminService.inquireIhioPrescriptionsByPrintCode({
      nationalNumber: input.nationalCode,
      printCode: 'test',
    })
    expect(api.post).not.toHaveBeenCalled()
    await expect(
      fanhubTaminService.inquireDrugPrescriptions({
        ...input,
        unknown: true,
      } as never)
    ).rejects.toThrow()
  })
})
