import { partyRoleSchema } from '@iap/api-types'
import fa from '@shared/i18n/locales/fa/common.json'
import { createInstance } from 'i18next'
import { describe, expect, it } from 'vitest'

import {
  PARTY_ROLE_TRANSLATION_KEYS,
  getPartyRoleOptions,
  partyRoleColors,
} from './user-account-options'

describe('ticket agent party role', () => {
  it('is accepted by the shared party role contract', () => {
    expect(partyRoleSchema.safeParse('ROLE_TICKET_AGENT').success).toBe(true)
  })

  it('maps to the reference badge style and Persian translation key', () => {
    expect(partyRoleColors.ROLE_TICKET_AGENT).toContain('bg-amber-100/30')
    expect(PARTY_ROLE_TRANSLATION_KEYS.ROLE_TICKET_AGENT).toBe(
      'parties.role.ticketAgent'
    )
    expect(fa.parties.role.ticketAgent).toBe('کارشناس تیکت')
  })

  it('exposes ticket agent in selector options', async () => {
    const i18n = createInstance()
    await i18n.init({
      defaultNS: 'common',
      lng: 'fa',
      ns: ['common'],
      resources: { fa: { common: fa } },
    })
    expect(getPartyRoleOptions(i18n.t)).toContainEqual({
      label: 'کارشناس تیکت',
      value: 'ROLE_TICKET_AGENT',
    })
  })
})
