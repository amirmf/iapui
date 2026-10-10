import { claimRequestService } from '@features/claim-requests'
import { describe, expect, it, vi } from 'vitest'

import { customerUserClaimRequestQueryOptions } from './use-customer-user-claim-request'

describe('useCustomerUserClaimRequest and options', () => {
  it('returns valid query options with queryKey matching reference', () => {
    const claimRequestId = 'req-123'
    const options = customerUserClaimRequestQueryOptions(claimRequestId)

    expect(options.queryKey).toEqual([
      'customerUserClaimRequest',
      claimRequestId,
    ])
    expect(options.enabled).toBe(true)
  })

  it('disables query when claimRequestId is empty', () => {
    const options = customerUserClaimRequestQueryOptions('')
    expect(options.enabled).toBe(false)
  })

  it('invokes claimRequestService.getById when queryFn is executed', async () => {
    const claimRequestId = 'req-456'
    const mockClaim = { id: claimRequestId, businessKey: 'BK-1' }
    const getByIdSpy = vi
      .spyOn(claimRequestService, 'getById')
      .mockResolvedValueOnce(mockClaim as never)

    const options = customerUserClaimRequestQueryOptions(claimRequestId)
    const controller = new AbortController()
    const result = await options.queryFn?.({
      signal: controller.signal,
    } as never)

    expect(getByIdSpy).toHaveBeenCalledWith(claimRequestId, {
      signal: controller.signal,
    })
    expect(result).toEqual(mockClaim)
  })
})
