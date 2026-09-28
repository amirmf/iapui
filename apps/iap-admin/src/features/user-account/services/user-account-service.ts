import { getApiClient } from '@iap/api-client'
import {
  type RegisterWithPartyPayload,
  type UpdateUserAccountPayload,
  type UpdateWithPartyPayload,
  deleteUserAccountRequestSchema,
  emptyExternalUnitsRequestSchema,
  emptyUserAccountActionResponseSchema,
  externalUnitListSchema,
  getUserAccountRequestSchema,
  listUserAccountsRequestSchema,
  pageUserAccountSchema,
  refreshUserAccountSnapshotRequestSchema,
  refreshUserAccountSnapshotResponseSchema,
  registerWithPartyRequestSchema,
  resetUserAccountPasswordRequestSchema,
  updateUserAccountRequestSchema,
  updateUserAccountWithPartyRequestSchema,
  userAccountPageRequestSchema,
  userAccountSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'
import { z } from 'zod'

export const userAccountService = {
  async createWithParty(input: RegisterWithPartyPayload) {
    const request = registerWithPartyRequestSchema.parse(input)
    const response = await getApiClient().post(
      '/auth/register-with-party',
      request
    )
    return userAccountSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteUserAccountRequestSchema.parse({ path: { id } })
    const response = await getApiClient().delete(
      `/auth/users/${request.path.id}`
    )
    return emptyUserAccountActionResponseSchema.parse(response.data)
  },
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
  async getExternalUnits(signal?: AbortSignal) {
    emptyExternalUnitsRequestSchema.parse({})
    const response = await getApiClient().get('/external-units', { signal })
    return externalUnitListSchema.parse(response.data)
  },
  async list(
    params: {
      branchLocations__in?: string
      docTypeCodes?: string[]
      parentUserAccountId?: string
      roles?: string
      signal?: AbortSignal
      textFilter?: string
    } = {}
  ) {
    const { signal, ...input } = params
    const request = listUserAccountsRequestSchema.parse(input)
    const response = await getApiClient().get('/auth/users', {
      params: request,
      signal,
    })
    return z.array(userAccountSchema).parse(response.data)
  },
  async getPageFull(input: {
    direction?: string
    filters: Record<string, string | number | string[] | undefined>
    page: number
    size: number
    signal?: AbortSignal
    sort?: string
  }) {
    const { signal, ...requestInput } = input
    const request = userAccountPageRequestSchema.parse(requestInput)
    const response = await getApiClient().get('/user-accounts/page-full', {
      params: {
        page: request.page,
        size: request.size,
        sort: request.sort,
        direction: request.direction,
        ...transformApiFilterParams(request.filters),
      },
      signal,
    })
    return pageUserAccountSchema.parse(response.data)
  },
  async resetPassword(id: string, password: string) {
    const request = resetUserAccountPasswordRequestSchema.parse({
      body: { password },
      path: { id },
    })
    const response = await getApiClient().post(
      `/auth/users/${request.path.id}/reset-password`,
      request.body
    )
    return emptyUserAccountActionResponseSchema.parse(response.data)
  },
  async refreshSnapshot(userAccountId: string) {
    const request = refreshUserAccountSnapshotRequestSchema.parse({
      path: { userAccountId },
    })
    const response = await getApiClient().post(
      `/core-connector/snapshots/${request.path.userAccountId}/refresh`
    )
    return refreshUserAccountSnapshotResponseSchema.parse(response.data)
  },
  async updateWithParty(id: string, body: UpdateWithPartyPayload) {
    const request = updateUserAccountWithPartyRequestSchema.parse({
      path: { id },
      body,
    })
    const response = await getApiClient().put(
      `/auth/users/${request.path.id}/with-party`,
      request.body
    )
    return userAccountSchema.parse(response.data)
  },
  async update(id: string, body: UpdateUserAccountPayload) {
    const request = updateUserAccountRequestSchema.parse({ path: { id }, body })
    const response = await getApiClient().put(
      `/auth/users/${request.path.id}`,
      request.body
    )
    return userAccountSchema.parse(response.data)
  },
}
