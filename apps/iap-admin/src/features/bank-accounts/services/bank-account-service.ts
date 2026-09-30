import { getApiClient } from '@iap/api-client'
import {
  bankAccountPageRequestSchema,
  bankAccountPageSchema,
  bulkDeleteBankAccountsRequestSchema,
  deleteBankAccountRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

const baseUrl = '/user-account-bank-account-numbers'

export const bankAccountService = {
  async bulkDelete(ids: string[]) {
    const request = bulkDeleteBankAccountsRequestSchema.parse({ body: ids })
    await getApiClient().delete(`${baseUrl}/bulk-delete`, {
      data: request.body,
    })
  },
  async delete(id: string) {
    const request = deleteBankAccountRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`${baseUrl}/${request.path.id}`)
  },
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = bankAccountPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 1000,
    })
    const response = await getApiClient().get(`${baseUrl}/page`, {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return bankAccountPageSchema.parse(response.data)
  },
}
