import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userAccountSelectionService } from './user-account-selection-service'

const apiClient = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const id = '550e8400-e29b-41d4-a716-446655440000'

describe('userAccountSelectionService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference get-by-id contract before transport', async () => {
    await expect(
      userAccountSelectionService.getById('not-a-uuid')
    ).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
  })

  it('uses the reference list path and filter names', async () => {
    apiClient.get.mockResolvedValue({
      data: [{ id, username: 'user-account' }],
    })

    await userAccountSelectionService.list({
      branchLocations__in: '42',
      parentUserAccountId: id,
      roles: 'ROLE_MAIN_ASSESSMENT_USER',
      text: '  account  ',
    })

    expect(apiClient.get).toHaveBeenCalledWith('/auth/users', {
      params: {
        branchLocations__in: '42',
        parentUserAccountId: id,
        roles: 'ROLE_MAIN_ASSESSMENT_USER',
        textFilter: 'account',
      },
      signal: undefined,
    })
  })
})
