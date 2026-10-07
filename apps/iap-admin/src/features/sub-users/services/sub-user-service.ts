import { getApiClient } from '@iap/api-client'
import {
  type PageSubUser,
  type ReleaseAssignmentsPayload,
  type ReleaseAssignmentsResponse,
  type SubUser,
  pageSubUserSchema,
  releaseAssignmentsPayloadSchema,
  releaseAssignmentsResponseSchema,
  subUserListSchema,
  subUserSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'
import { z } from 'zod'

import type {
  CreateSubUserPayload,
  UpdateSubUserPayload,
} from '../model/sub-user-form-schema'

const SUB_USERS_BASE_PATH = '/auth/sub-users'
const ASSIGNMENTS_RELEASE_PATH = '/claim-requests/assignments/release'

export interface ListSubUsersParams {
  enabled?: boolean
  page?: number
  size?: number
  status?: string | string[]
  textFilter?: string
  [key: string]: unknown
}

export interface ListPageParams {
  direction?: string
  filters?: ApiFilterParams
  page?: number
  signal?: AbortSignal
  size?: number
  sort?: string
}

export const subUserService = {
  async create(payload: CreateSubUserPayload): Promise<SubUser> {
    const response = await getApiClient().post(SUB_USERS_BASE_PATH, payload)
    return subUserSchema.parse(response.data)
  },

  async disable(id: string): Promise<SubUser> {
    const validId = z.uuid().parse(id)
    const response = await getApiClient().post(
      `${SUB_USERS_BASE_PATH}/${validId}/disable`
    )
    return subUserSchema.parse(response.data)
  },

  async getById(id: string, signal?: AbortSignal): Promise<SubUser> {
    const validId = z.uuid().parse(id)
    const response = await getApiClient().get(
      `${SUB_USERS_BASE_PATH}/${validId}`,
      {
        signal,
      }
    )
    return subUserSchema.parse(response.data)
  },

  async list(
    params: ListSubUsersParams = {},
    signal?: AbortSignal
  ): Promise<SubUser[]> {
    const response = await getApiClient().get(SUB_USERS_BASE_PATH, {
      params,
      signal,
    })
    return subUserListSchema.parse(response.data)
  },

  async listPage(props: ListPageParams = {}): Promise<PageSubUser> {
    const { direction, filters = {}, page = 0, signal, size = 40, sort } = props
    const response = await getApiClient().get(`${SUB_USERS_BASE_PATH}/page`, {
      params: {
        direction,
        page,
        size,
        sort,
        ...transformApiFilterParams(filters),
      },
      signal,
    })
    return pageSubUserSchema.parse(response.data)
  },

  async releaseAssignments(
    payload: ReleaseAssignmentsPayload
  ): Promise<ReleaseAssignmentsResponse> {
    const valid = releaseAssignmentsPayloadSchema.parse(payload)
    const response = await getApiClient().post(ASSIGNMENTS_RELEASE_PATH, valid)
    return releaseAssignmentsResponseSchema.parse(response.data)
  },

  async update(id: string, payload: UpdateSubUserPayload): Promise<SubUser> {
    const validId = z.uuid().parse(id)
    const response = await getApiClient().put(
      `${SUB_USERS_BASE_PATH}/${validId}`,
      payload
    )
    return subUserSchema.parse(response.data)
  },
}

export default subUserService
