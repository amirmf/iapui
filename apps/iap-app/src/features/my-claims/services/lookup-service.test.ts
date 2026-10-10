import { insurancePolicyService } from '@features/my-claims/services/insurance-policy-service'
import { subInsuredPersonService } from '@features/my-claims/services/sub-insured-person-service'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('@iap/api-client', () => ({ getApiClient: () => ({ get }) }))

beforeEach(() => get.mockReset())

describe('customer filter lookups', () => {
  it('loads and validates the authenticated policy array', async () => {
    get.mockResolvedValue({ data: [{ id: 7, planId: 2, title: 'Policy' }] })
    await expect(insurancePolicyService.getAll()).resolves.toEqual([
      { id: 7, planId: 2, title: 'Policy' },
    ])
    expect(get).toHaveBeenCalledWith('/my/iap/my-policies')
  })

  it('places policy ID in the person lookup path and validates nullable source fields', async () => {
    get.mockResolvedValue({
      data: [
        {
          id: null,
          fullName: 'Person',
          nationalCode: '0012345678',
          isForeign: null,
        },
      ],
    })
    await expect(subInsuredPersonService.getAll(7)).resolves.toEqual([
      {
        id: null,
        fullName: 'Person',
        nationalCode: '0012345678',
        isForeign: null,
      },
    ])
    expect(get).toHaveBeenCalledWith('/my/iap/sub-insured-people/7')
  })

  it('rejects invalid requests before transport and invalid response items', async () => {
    await expect(subInsuredPersonService.getAll(Number.NaN)).rejects.toThrow()
    expect(get).not.toHaveBeenCalled()
    get.mockResolvedValue({ data: [{ id: '7', title: 'Policy', planId: 2 }] })
    await expect(insurancePolicyService.getAll()).rejects.toThrow()
  })
})
