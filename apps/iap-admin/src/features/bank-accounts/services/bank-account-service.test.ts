import { bankAccountPageSchema, yesNoSchema } from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { bankAccountService } from './bank-account-service'

const id = '8a7cbf00-1892-4d99-9b83-0662c822058e'
const apiClient = vi.hoisted(() => ({ delete: vi.fn(), get: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('bankAccountService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference page endpoint, filters, and default server sort', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({
      data: {
        content: [
          {
            bankAccountNumber: 'IR820540102680020817909002',
            bankAccountType: 'IBAN',
            userId: id,
          },
        ],
      },
    })

    await expect(
      bankAccountService.getPage({
        filters: {
          bankAccountType: ['IBAN', 'CARD'],
          direction: 'desc',
          sort: 'createdAt',
        },
        page: 2,
        signal,
        size: 40,
      })
    ).resolves.toMatchObject({ content: [{ userId: id }] })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/user-account-bank-account-numbers/page',
      {
        params: {
          bankAccountType__in: 'IBAN,CARD',
          direction: 'desc',
          page: 2,
          size: 40,
          sort: 'createdAt',
        },
        signal,
      }
    )
  })

  it('uses the reference service default size when callers omit pagination', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })

    await bankAccountService.getPage({})

    expect(apiClient.get).toHaveBeenCalledWith(
      '/user-account-bank-account-numbers/page',
      {
        params: { page: 0, size: 1000 },
        signal: undefined,
      }
    )
  })

  it('uses the reference delete endpoints and validates UUID input', async () => {
    await bankAccountService.delete(id)
    await bankAccountService.bulkDelete([id])

    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      `/user-account-bank-account-numbers/${id}`
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      '/user-account-bank-account-numbers/bulk-delete',
      { data: [id] }
    )

    await expect(bankAccountService.delete('not-a-uuid')).rejects.toThrow()
    await expect(bankAccountService.bulkDelete([])).rejects.toThrow()
  })

  it('accepts a page response without content like the reference schema', async () => {
    apiClient.get.mockResolvedValue({ data: {} })
    await expect(bankAccountService.getPage({})).resolves.toEqual({})
  })

  it('matches the reference page schema optionality and strips unknown fields', () => {
    expect(yesNoSchema.options).toEqual(['Y', 'N'])
    expect(
      bankAccountPageSchema.parse({
        content: [
          {
            bankAccountNumber: 'IR820540102680020817909002',
            bankAccountType: 'IBAN',
            userId: id,
            untrustedField: 'discarded',
          },
        ],
        untrustedPageField: 'discarded',
      })
    ).toEqual({
      content: [
        {
          bankAccountNumber: 'IR820540102680020817909002',
          bankAccountType: 'IBAN',
          userId: id,
        },
      ],
    })
  })
})
