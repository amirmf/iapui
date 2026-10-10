import { myClaimRequestService } from '@features/my-claims/services/my-claim-request-service'
import fixture from '@features/my-claims/services/reference-translations.fixture.json'
import { configureApiClient, getApiClient } from '@iap/api-client'
import common from '@shared/i18n/locales/fa/common.json'
import { afterEach, describe, expect, it, vi } from 'vitest'

configureApiClient('https://example.test')
afterEach(() => vi.restoreAllMocks())

describe('My Claims wire contract', () => {
  it('preserves service defaults and nullish content', async () => {
    const get = vi
      .spyOn(getApiClient(), 'get')
      .mockResolvedValue({ data: { content: null } })
    expect(await myClaimRequestService.getPage({})).toEqual({ content: null })
    expect(get).toHaveBeenCalledWith('/my/iap/claim-requests/page-full', {
      params: { page: 0, size: 10 },
      signal: undefined,
    })
  })
  it('sends scoped page size, transformed filters and cancellation signal', async () => {
    const signal = new AbortController().signal
    const get = vi
      .spyOn(getApiClient(), 'get')
      .mockResolvedValue({ data: { content: [] } })
    await myClaimRequestService.getPage({
      page: 2,
      size: 9,
      filters: { status: ['PAID'], extPaymentDate: 'null' },
      signal,
    })
    expect(get).toHaveBeenCalledWith('/my/iap/claim-requests/page-full', {
      params: { page: 2, size: 9, status__in: 'PAID', extPaymentDate: 'null' },
      signal,
    })
  })
  it('rejects invalid nested responses and invalid outgoing pages', async () => {
    const get = vi
      .spyOn(getApiClient(), 'get')
      .mockResolvedValue({ data: { content: [{ status: 'UNKNOWN' }] } })
    await expect(myClaimRequestService.getPage({})).rejects.toThrow()
    await expect(myClaimRequestService.getPage({ page: -1 })).rejects.toThrow()
    expect(get).toHaveBeenCalledTimes(1)
  })
  it('uses source delete path and propagates rejection', async () => {
    const remove = vi
      .spyOn(getApiClient(), 'delete')
      .mockResolvedValue({ data: '' })
    await expect(
      myClaimRequestService.delete('claim-id')
    ).resolves.toBeUndefined()
    expect(remove).toHaveBeenCalledWith('/my/iap/claim-requests/claim-id')
    remove.mockRejectedValueOnce(new Error('delete failed'))
    await expect(myClaimRequestService.delete('claim-id')).rejects.toThrow(
      'delete failed'
    )
  })
  it('keeps every extracted Persian translation equal to reference fixture', () => {
    for (const [key, value] of Object.entries(fixture.values)) {
      const actual = key
        .split('.')
        .reduce<unknown>(
          (node, part) => (node as Record<string, unknown>)?.[part],
          common
        )
      expect(actual, key).toEqual(value)
    }
  })
})
