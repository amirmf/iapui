import fa from '@shared/i18n/locales/fa/common.json'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

import { updateUserAccountSchema } from './user-account-form-schema'

describe('user-account validation translation parity', () => {
  it('does not invent username validation translations missing from the reference locale', () => {
    expect('usernameMaxLength' in fa.auth.validation).toBe(false)
    expect('usernamePattern' in fa.auth.validation).toBe(false)
  })

  it('uses the reference defaults for account flags', () => {
    const t = ((key: string) => key) as TFunction
    const result = updateUserAccountSchema(t).safeParse({
      mobileNumber: '09123456789',
      username: '1234567890',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toMatchObject({
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true,
      })
    }
  })
})
