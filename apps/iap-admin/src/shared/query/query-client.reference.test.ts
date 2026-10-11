import { extractErrorMessage } from '@iap/api-client'
import { toastError } from '@iap/ui'
import { createAppQueryClient } from '@shared/query/query-client'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@iap/ui', () => ({ toastError: vi.fn() }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

const reference = { presentation: 'reference' } as const

describe('opt-in reference mutation errors', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps source generic status 204 only in reference presentation', () => {
    expect(extractErrorMessage({ status: 204 }, reference)).toBe(
      'Content not found.'
    )
    expect(extractErrorMessage({ status: 204 })).toBeUndefined()
  })

  it('keeps source Axios message cancellation only in reference presentation', () => {
    const error = new AxiosError('Operation cancelled by user')
    expect(extractErrorMessage(error, reference)).toBeUndefined()
    expect(extractErrorMessage(error)).toBe('Operation cancelled by user')
  })

  it.each([
    [undefined, 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'],
    [{ errorPresentation: 'reference' }, 'Something went wrong!'],
  ])(
    'preserves scoped fallback and unchanged default %j',
    async (meta, message) => {
      const client = createAppQueryClient({ onUnauthorized: vi.fn() })
      const mutation = client.getMutationCache().build(client, {
        meta,
        mutationFn: async () => {
          throw undefined
        },
      })
      await expect(mutation.execute(undefined)).rejects.toBeUndefined()
      expect(toastError).toHaveBeenCalledExactlyOnceWith({ message })
      expect(toast.error).not.toHaveBeenCalled()
    }
  )

  it.each([
    [undefined, 'محتوا تغییری نکرده است.'],
    [{ errorPresentation: 'reference' }, 'Content not modified!'],
  ])('preserves 304 extra toast and sequencing %j', async (meta, message) => {
    const client = createAppQueryClient({ onUnauthorized: vi.fn() })
    const error = new AxiosError(
      'Request failed',
      undefined,
      undefined,
      undefined,
      {
        status: 304,
        statusText: 'Not Modified',
        data: {},
        headers: {},
        config: {} as never,
      }
    )
    const mutation = client.getMutationCache().build(client, {
      meta,
      mutationFn: async () => {
        throw error
      },
    })
    await expect(mutation.execute(undefined)).rejects.toBe(error)
    expect(toastError).toHaveBeenCalledExactlyOnceWith({
      message: 'Not Modified',
    })
    expect(toast.error).toHaveBeenCalledExactlyOnceWith(message)
    expect(vi.mocked(toastError).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(toast.error).mock.invocationCallOrder[0]!
    )
  })
})
