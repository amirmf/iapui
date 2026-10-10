import { getApiClient } from '@iap/api-client'
import { describe, expect, it, vi } from 'vitest'

import { preAuthService } from './pre-auth-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('preAuthService', () => {
  it('requests pre-authorizations page from backend and parses result', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: {
        content: [
          {
            amount: 5000000,
            desc: 'Dental service authorization',
            franchise: 1000000,
            id: 1,
            illnessDesc: 'Dental',
            illnessId: 201,
            issuDate: '1403/07/01',
            nationalCode: '0012345678',
            policyId: 10,
            preAuthValidityBeginDate: '1403/07/01',
            preAuthValidityEndDate: '1403/07/30',
            receptionDate: '1403/07/05',
            status: 102,
          },
        ],
        totalElements: 1,
        totalPages: 1,
      },
    })
    vi.mocked(getApiClient).mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<typeof getApiClient>)

    const result = await preAuthService.getPage({
      nationalCode: '0012345678',
      page: 0,
      policyId: 10,
      size: 9,
    })

    expect(mockGet).toHaveBeenCalledWith('/my/iap/pre-auths/page-full', {
      params: {
        nationalCode: '0012345678',
        page: 0,
        policyId: 10,
        size: 9,
      },
      signal: undefined,
    })
    expect(result.content).toHaveLength(1)
    expect(result.content?.[0].id).toBe(1)
    expect(result.content?.[0].status).toBe(102)
  })
})
