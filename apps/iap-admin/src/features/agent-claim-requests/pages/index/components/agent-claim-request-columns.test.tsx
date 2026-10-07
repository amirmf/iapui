// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAgentClaimRequestColumns } from './agent-claim-request-columns'

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('useAgentClaimRequestColumns', () => {
  afterEach(cleanup)

  it('defines the required columns matching reference layout', () => {
    const { result } = renderHook(() => useAgentClaimRequestColumns())
    const columns = result.current

    const keys = columns.map((col) =>
      'accessorKey' in col ? col.accessorKey : col.id
    )

    expect(keys).toContain('extNationalCode')
    expect(keys).toContain('extDisplayName')
    expect(keys).toContain('businessKey')
    expect(keys).toContain('docType.id')
    expect(keys).toContain('amount')
    expect(keys).toContain('status')
    expect(keys).toContain('submitDate')
    expect(keys).toContain('extPolicyId')
    expect(keys).toContain('extWorkUnitName')
    expect(keys).toContain('extWorkUnitProvinceName')
    expect(keys).toContain('actions')

    // Hidden columns
    expect(keys).toContain('extContractId')
    expect(keys).toContain('extMainNationalCode')
    expect(keys).toContain('extCustomerName')
    expect(keys).toContain('extPlanCaption')
    expect(keys).toContain('totalSumAmount')
    expect(keys).toContain('createdAt')
    expect(keys).toContain('aiStatus')
  })
})
