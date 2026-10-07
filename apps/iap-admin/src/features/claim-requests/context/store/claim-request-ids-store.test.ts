import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import { beforeEach, describe, expect, it } from 'vitest'

describe('reference claim-request loaded ID coordination', () => {
  beforeEach(() => useClaimRequestIds.getState().setIds([]))

  it('replaces loaded IDs and removes only the first matching ID', () => {
    useClaimRequestIds.getState().setIds(['a', 'b', 'a'])
    useClaimRequestIds.getState().setRemoveId('a')
    expect(useClaimRequestIds.getState().ids).toEqual(['b', 'a'])
    useClaimRequestIds.getState().setIds(['c'])
    expect(useClaimRequestIds.getState().ids).toEqual(['c'])
  })

  it('preserves state when the clicked ID is not in the loaded page', () => {
    useClaimRequestIds.getState().setIds(['a'])
    const state = useClaimRequestIds.getState()
    useClaimRequestIds.getState().setRemoveId('')
    expect(useClaimRequestIds.getState()).toBe(state)
  })
})
