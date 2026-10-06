import { describe, expect, it } from 'vitest'

import {
  DOCTOR_USER_ROLE,
  SUB_USER_ROLES,
  getSubUserRoleOptions,
  subUserStatusColors,
} from './sub-user-constant'

describe('sub-user-constant', () => {
  it('defines doctor role constant', () => {
    expect(DOCTOR_USER_ROLE).toBe('ROLE_DOCTOR_USER')
  })

  it('defines status colors for enabled and disabled', () => {
    expect(subUserStatusColors.enabled).toContain('bg-green')
    expect(subUserStatusColors.disabled).toContain('bg-red')
  })

  it('provides translated role options', () => {
    const t = (key: string) => key
    const options = getSubUserRoleOptions(t as never)
    expect(options).toHaveLength(3)
    expect(options.map((o) => o.value)).toEqual(SUB_USER_ROLES)
  })
})
