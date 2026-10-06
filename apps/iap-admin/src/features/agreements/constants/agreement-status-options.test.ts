import { describe, expect, it, vi } from 'vitest'

import {
  agreementStatusClasses,
  agreementStatusTranslationKeys,
  getAgreementStatusOptions,
} from './agreement-status-options'

describe('agreement status presentation', () => {
  it('maps every API status to its reference translation key and visual class', () => {
    expect(agreementStatusTranslationKeys).toEqual({
      ACTIVE: 'agreements.status.active',
      DRAFT: 'agreements.status.draft',
      EXPIRED: 'agreements.status.expired',
      INACTIVE: 'agreements.status.inactive',
      TERMINATED: 'agreements.status.terminated',
    })
    expect(Object.keys(agreementStatusClasses)).toEqual(
      Object.keys(agreementStatusTranslationKeys)
    )
  })

  it('uses translations as the filter labels while preserving API status values', () => {
    const translate = vi.fn((key: string) => `translated:${key}`)

    expect(getAgreementStatusOptions(translate as never)).toEqual([
      { label: 'translated:agreements.status.active', value: 'ACTIVE' },
      { label: 'translated:agreements.status.inactive', value: 'INACTIVE' },
      { label: 'translated:agreements.status.draft', value: 'DRAFT' },
      { label: 'translated:agreements.status.expired', value: 'EXPIRED' },
      {
        label: 'translated:agreements.status.terminated',
        value: 'TERMINATED',
      },
    ])
    expect(translate).toHaveBeenCalledTimes(5)
  })
})
