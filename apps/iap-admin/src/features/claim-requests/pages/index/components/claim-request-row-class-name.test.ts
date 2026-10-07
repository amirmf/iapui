import { getClaimRequestRowClassName } from '@features/claim-requests/pages/index/components/claim-request-row-class-name'
import type { ClaimRequest } from '@iap/api-types'
import type { Row } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'

describe('reference special disease row colors', () => {
  const row = (original: ClaimRequest) => ({ original }) as Row<ClaimRequest>
  it('leaves ordinary rows unchanged and prioritizes VIP in mixed disease arrays', () => {
    expect(getClaimRequestRowClassName(row({}))).toBeUndefined()
    expect(
      getClaimRequestRowClassName(row({ specialDiseases: [] }))
    ).toBeUndefined()
    expect(
      getClaimRequestRowClassName(
        row({ specialDiseases: ['LEVEL_ONE', 'VIP'] })
      )
    ).toBe(
      'special-disease-row bg-primary/10 hover:bg-primary/15 data-[state=selected]:bg-primary/20'
    )
    expect(
      getClaimRequestRowClassName(row({ specialDiseases: ['SACRIFICE'] }))
    ).toBe(
      'special-disease-row bg-destructive/10 hover:bg-destructive/15 data-[state=selected]:bg-destructive/20'
    )
  })
})
