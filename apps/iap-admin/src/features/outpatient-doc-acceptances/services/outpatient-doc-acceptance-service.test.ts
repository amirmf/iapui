import { describe, expect, it, vi } from 'vitest'

const api = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

vi.mock('@iap/api-client', () => ({
  getApiClient: () => api,
}))

const { outpatientDocAcceptanceService } =
  await import('./outpatient-doc-acceptance-service')

const page = {
  content: [{ id: 'a1', extId: 12 }],
  number: 0,
  size: 20,
  numberOfElements: 1,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

describe('outpatientDocAcceptanceService', () => {
  it('parses page responses and forwards pagination and filters', async () => {
    api.get.mockResolvedValueOnce({ data: page })

    const result = await outpatientDocAcceptanceService.getPage({
      page: 0,
      size: 20,
      filters: { exId: '12' },
    })

    expect(result).toEqual(page)
    expect(api.get).toHaveBeenCalledWith(
      '/outpatient-doc-acceptances/page',
      expect.objectContaining({
        params: expect.objectContaining({ page: 0, size: 20 }),
      })
    )
  })

  it('forwards source explicit sorting as well as array filter serialization', async () => {
    api.get.mockResolvedValueOnce({ data: page })
    await outpatientDocAcceptanceService.getPage({
      sort: 'exId',
      direction: 'desc',
      filters: { status: ['SUBMIT', 'FAILED'] },
    })
    expect(api.get).toHaveBeenLastCalledWith(
      '/outpatient-doc-acceptances/page',
      expect.objectContaining({
        params: expect.objectContaining({
          sort: 'exId',
          direction: 'desc',
          status__in: 'SUBMIT,FAILED',
        }),
      })
    )
  })
  it('serializes generation dates before posting', async () => {
    api.post.mockResolvedValueOnce({ data: [] })
    const date = new Date('2026-01-02T03:04:05.000Z')

    await outpatientDocAcceptanceService.generate({ date })

    expect(api.post).toHaveBeenCalledWith(
      '/outpatient-doc-acceptances/generate',
      {
        date: date.toISOString(),
      }
    )
  })

  it('returns null for a missing claim and preserves other failures', async () => {
    api.get.mockRejectedValueOnce({ response: { status: 404 } })
    await expect(
      outpatientDocAcceptanceService.getClaim('a1')
    ).resolves.toBeNull()

    api.get.mockRejectedValueOnce({ response: { status: 500 } })
    await expect(
      outpatientDocAcceptanceService.getClaim('a1')
    ).rejects.toMatchObject({ response: { status: 500 } })
  })

  it('uses the bulk delete endpoint with selected ids', async () => {
    api.delete.mockResolvedValueOnce({ data: null })

    await outpatientDocAcceptanceService.bulkDelete(['a1', 'a2'])

    expect(api.delete).toHaveBeenCalledWith(
      '/outpatient-doc-acceptances/bulk-delete',
      {
        data: ['a1', 'a2'],
      }
    )
  })
})

describe('reference payload mapping', () => {
  it('maps numeric strings and removes empty numeric/text fields before acceptance mutations', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 'a1' } })
    await outpatientDocAcceptanceService.create({
      exId: ' 12 ',
      totalAmount: 'invalid',
      letterNo: '  ',
      status: 'SUBMIT',
    })
    expect(api.post).toHaveBeenLastCalledWith('/outpatient-doc-acceptances', {
      exId: 12,
      status: 'SUBMIT',
    })
  })

  it('preserves explicit claim and issuance ids before falling back to the parent id', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    await outpatientDocAcceptanceService.createClaim('42', {
      acceptanceId: '17',
      hasPreAuth: false,
      estimateAmount: '90',
    })
    expect(api.post).toHaveBeenLastCalledWith('/outpatient-claims/42', {
      acceptanceId: 17,
      hasPreAuth: false,
      estimateAmount: 90,
    })
    api.put.mockResolvedValueOnce({ data: {} })
    await outpatientDocAcceptanceService.updateIssuance('42', {
      amount: '80',
      autoCalc: false,
    })
    expect(api.put).toHaveBeenLastCalledWith('/issuances/42', {
      docAcceptanceId: 42,
      amount: 80,
      autoCalc: false,
    })
  })

  it('maps damage form numeric strings and injects docAcceptanceId on create and update', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    await outpatientDocAcceptanceService.createDmgCase('42', {
      approvedAmount: '100',
      isCalculated: false,
      serviceDate: ' 2026-01-02 ',
    })
    expect(api.post).toHaveBeenLastCalledWith('/dmg-cases/42', {
      approvedAmount: 100,
      isCalculated: false,
      serviceDate: '2026-01-02',
      docAcceptanceId: 42,
    })
    api.put.mockResolvedValueOnce({ data: {} })
    await outpatientDocAcceptanceService.updateDmgCase('42', 'd1', {
      medicalSystemCode: '12',
    })
    expect(api.put).toHaveBeenLastCalledWith('/dmg-cases/42/d1', {
      medicalSystemCode: 12,
      docAcceptanceId: 42,
    })
  })

  it('omits submission date exactly as the reference does', async () => {
    api.post.mockResolvedValueOnce({ data: [] })
    await outpatientDocAcceptanceService.send({
      outpatientDocAcceptanceId: 'a1',
      date: new Date(),
    })
    expect(api.post).toHaveBeenLastCalledWith(
      '/outpatient-doc-acceptances/send',
      { outpatientDocAcceptanceId: 'a1' }
    )
  })

  it('rejects malformed mutation response arrays rather than pretending they are empty', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    await expect(
      outpatientDocAcceptanceService.generateAdjustment({})
    ).rejects.toThrow()
  })
})
