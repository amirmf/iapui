import { useUserAccountStore } from '@features/user-account/model/user-account-store'
import { userAccountSchema } from '@iap/api-types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const firstUser = userAccountSchema.parse({
  id: '11111111-1111-4111-8111-111111111111',
  username: 'first-user',
})
const secondUser = userAccountSchema.parse({
  id: '22222222-2222-4222-8222-222222222222',
  username: 'second-user',
})

describe('useUserAccountStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useUserAccountStore.getState().reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not clear a newly opened dialog after an earlier dialog closes', () => {
    useUserAccountStore.getState().openDialog('view', firstUser)
    useUserAccountStore.getState().closeDialog()
    useUserAccountStore.getState().openDialog('delete', secondUser)

    vi.advanceTimersByTime(500)

    expect(useUserAccountStore.getState()).toMatchObject({
      currentUser: secondUser,
      dialog: 'delete',
    })
  })
})
