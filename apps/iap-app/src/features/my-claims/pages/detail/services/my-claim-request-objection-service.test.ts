import { myClaimRequestObjectionFormSchema } from '@features/my-claims/pages/detail/model/my-claim-request-objection-schema'
import myClaimRequestService from '@features/my-claims/pages/detail/services/my-claim-request-objection-service'
import { configureApiClient, getApiClient } from '@iap/api-client'
import { afterEach, describe, expect, it, vi } from 'vitest'

configureApiClient('https://example.test')
afterEach(() => vi.restoreAllMocks())
describe('customer objection reference contracts', () => {
  it('posts source fields and defaults attachments for document completion', async () => {
    const post = vi
      .spyOn(getApiClient(), 'post')
      .mockResolvedValue({ data: { id: 'claim-1', status: 'IN_ASSESSMENT' } })
    await expect(
      myClaimRequestService.submitObjection({
        claimRequestId: 'claim-1',
        description: '-',
        claimRequestStatus: 'IN_ASSESSMENT',
      })
    ).resolves.toMatchObject({ id: 'claim-1' })
    expect(post).toHaveBeenCalledWith('/my/iap/claim-requests/objections', {
      claimRequestId: 'claim-1',
      description: '-',
      attachments: [],
      claimRequestStatus: 'IN_ASSESSMENT',
    })
  })
  it('rejects malformed nested response before updating query state', async () => {
    vi.spyOn(getApiClient(), 'post').mockResolvedValue({
      data: { objections: [{ roleType: 'UNKNOWN' }] },
    })
    await expect(
      myClaimRequestService.submitObjection({
        claimRequestId: 'claim-1',
        description: '-',
      })
    ).rejects.toThrow()
  })
  it('requires uploaded attachments for regular submit while preserving trimmed description', () => {
    const schema = myClaimRequestObjectionFormSchema((key) => key)
    const parsed = schema.safeParse({ formDescription: '  ', attachments: [] })
    expect(parsed.success).toBe(false)
    if (!parsed.success)
      expect(parsed.error.issues.map((issue) => issue.message)).toEqual([
        'myiap.claimRequest.messages.descriptionRequired',
        'myiap.claimRequest.messages.attachmentsRequired',
      ])
  })
})
