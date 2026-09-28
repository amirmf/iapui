import { getApiClient } from '@iap/api-client'
import {
  getUserAccountRequestSchema,
  listUserAccountsRequestSchema,
  userAccountSchema,
} from '@iap/api-types'
import { z } from 'zod'

export const userAccountSelectionService = {
  async getById(id: string, signal?: AbortSignal) {
    const request = getUserAccountRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/auth/users/${request.path.id}`,
      {
        signal,
      }
    )
    return userAccountSchema.parse(response.data)
  },
  async list(
    input: {
      branchLocations__in?: string
      excludeUserAccountId?: string
      parentUserAccountId?: string
      roles?: string
      text?: string
    },
    signal?: AbortSignal
  ) {
    const request = listUserAccountsRequestSchema.parse({
      branchLocations__in: input.branchLocations__in,
      parentUserAccountId: input.parentUserAccountId,
      roles: input.roles,
      textFilter: input.text?.trim() || undefined,
    })
    const response = await getApiClient().get('/auth/users', {
      params: request,
      signal,
    })
    const users = z.array(userAccountSchema).parse(response.data)
    return input.excludeUserAccountId
      ? users.filter((user) => user.id !== input.excludeUserAccountId)
      : users
  },
}
