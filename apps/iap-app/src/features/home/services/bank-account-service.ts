import { getApiClient } from '@iap/api-client'
import {
  type AddMyBankAccountRequest,
  type BankAccount,
  addMyBankAccountRequestSchema,
  bankAccountSchema,
} from '@iap/api-types'
import { z } from 'zod'

const bankAccountIdSchema = z.string().uuid()

export const bankAccountService = {
  getMyBankAccount: async (options?: {
    signal?: AbortSignal
  }): Promise<BankAccount> => {
    const response = await getApiClient().get<unknown>(
      '/my/iap/my-bank-account',
      {
        signal: options?.signal,
      }
    )
    return bankAccountSchema.parse(response.data)
  },

  addMyBankAccount: async (
    payload: AddMyBankAccountRequest
  ): Promise<BankAccount> => {
    const validated = addMyBankAccountRequestSchema.parse(payload)
    const response = await getApiClient().post<unknown>(
      '/my/iap/add-my-bank-account',
      validated
    )
    return bankAccountSchema.parse(response.data)
  },

  editMyBankAccount: async (
    id: string,
    payload: AddMyBankAccountRequest
  ): Promise<BankAccount> => {
    const validatedId = bankAccountIdSchema.parse(id)
    const validatedPayload = addMyBankAccountRequestSchema.parse(payload)
    const response = await getApiClient().put<unknown>(
      `/my/iap/my-bank-account/${validatedId}`,
      validatedPayload
    )
    return bankAccountSchema.parse(response.data)
  },
}

export default bankAccountService
