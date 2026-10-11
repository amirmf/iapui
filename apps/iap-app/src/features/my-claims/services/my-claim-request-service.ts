import {
  type MyBankAccountRequest,
  myBankAccountRequestSchema,
  myBankAccountResponseSchema,
} from '@features/my-claims/model/my-bank-account-schema'
import type { MyClaimRequestPayload } from '@features/my-claims/model/my-claim-request-form-schema'
import { getApiClient } from '@iap/api-client'
import {
  claimRequestIdSchema,
  claimRequestRequestSchema,
  claimRequestSchema,
  claimRequestVoidResponseSchema,
  myClaimRequestPageRequestSchema,
  pageClaimRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'
import { format } from 'date-fns'
import type { z } from 'zod'

type PageParams = z.input<typeof myClaimRequestPageRequestSchema> & {
  signal?: AbortSignal
}

export const myClaimRequestService = {
  getById: async (id: string, options?: { signal?: AbortSignal }) => {
    const claimId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().get<unknown>(
      `/my/iap/claim-requests/${claimId}`,
      { signal: options?.signal }
    )
    return claimRequestSchema.parse(response.data)
  },
  getMyBankAccount: async () =>
    myBankAccountResponseSchema.parse(
      (await getApiClient().get<unknown>('/my/iap/my-bank-account')).data
    ),
  addMyBankAccount: async (payload: MyBankAccountRequest) => {
    const body = myBankAccountRequestSchema.parse(payload)
    return myBankAccountResponseSchema.parse(
      (await getApiClient().post<unknown>('/my/iap/add-my-bank-account', body))
        .data
    )
  },
  editMyBankAccount: async (id: string, payload: MyBankAccountRequest) => {
    const body = myBankAccountRequestSchema.parse(payload)
    return myBankAccountResponseSchema.parse(
      (await getApiClient().put<unknown>(`/my/iap/my-bank-account/${id}`, body))
        .data
    )
  },
  create: async (data: MyClaimRequestPayload) => {
    const payload = claimRequestRequestSchema.parse({
      ...data,
      amount: Number(data.amount),
      docType: { id: data.docType.id },
      extNationalCode: data.extNationalCode,
      submitDate: format(data.submitDate, 'yyyy-MM-dd'),
      attachments: data.attachments ?? [],
    })
    const response = await getApiClient().post<unknown>(
      '/claim-requests',
      payload
    )
    return claimRequestSchema.parse(response.data)
  },
  getPage: async (params: PageParams) => {
    const { signal, ...request } = params
    const { page, size, filters } =
      myClaimRequestPageRequestSchema.parse(request)
    const response = await getApiClient().get<unknown>(
      '/my/iap/claim-requests/page-full',
      {
        params: { page, size, ...transformApiFilterParams(filters) },
        signal,
      }
    )
    return pageClaimRequestSchema.parse(response.data)
  },
  delete: async (id: string): Promise<void> => {
    const claimId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().delete<unknown>(
      `/my/iap/claim-requests/${claimId}`
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
}
export default myClaimRequestService
