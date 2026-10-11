import { myClaimRequestService } from '@features/my-claims/services/my-claim-request-service'
import { configureApiClient, getApiClient } from '@iap/api-client'
import common from '@shared/i18n/locales/fa/common.json'
import { afterEach, expect, it, vi } from 'vitest'

configureApiClient('https://example.test')
afterEach(() => vi.restoreAllMocks())
it('loads the reference detail endpoint with cancellation and parses nested responses', async () => {
  const signal = new AbortController().signal
  const get = vi.spyOn(getApiClient(), 'get').mockResolvedValue({
    data: { id: 'claim', status: 'RETURN', objections: [] },
  })
  expect(
    await myClaimRequestService.getById('claim', { signal })
  ).toMatchObject({ id: 'claim', status: 'RETURN' })
  expect(get).toHaveBeenCalledWith('/my/iap/claim-requests/claim', { signal })
  get.mockResolvedValueOnce({ data: { status: 'UNKNOWN' } })
  await expect(myClaimRequestService.getById('claim')).rejects.toThrow()
  get.mockResolvedValueOnce({ data: { attachments: [{ filename: 'x' }] } })
  await expect(myClaimRequestService.getById('claim')).rejects.toThrow()
})
it('uses the exact reference page heading and missing-value translations', () => {
  expect(common.claimRequests.actions.viewDetails).toBe('مشاهده جزئیات')
  expect(common.common.notAvailable).toBe('در دسترس نیست')
})
