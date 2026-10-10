import type { ClaimRequest } from '@iap/api-types'
import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerUserClaimRequestColumns } from './customer-user-claim-request-columns'

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

describe('useCustomerUserClaimRequestColumns', () => {
  it('defines the 10 customer user claim request columns matching reference', () => {
    const { result } = renderHook(() => useCustomerUserClaimRequestColumns())
    const columns = result.current

    expect(columns).toHaveLength(10)

    const expectedColumnKeys = [
      'extNationalCode',
      'extDisplayName',
      'businessKey',
      'docType.id',
      'amount',
      'status',
      'submitDate',
      'latestAssignementDisplayName',
      'extPolicyId',
      'extWorkUnitName',
    ]

    const actualKeys = columns.map(
      (col) => ('accessorKey' in col ? col.accessorKey : col.id) as string
    )
    expect(actualKeys).toEqual(expectedColumnKeys)
  })

  it('renders status and aiStatus badges in status column', () => {
    const { result } = renderHook(() => useCustomerUserClaimRequestColumns())
    const statusCol = result.current.find(
      (col) => ('accessorKey' in col ? col.accessorKey : col.id) === 'status'
    )
    expect(statusCol).toBeDefined()

    const mockRow = {
      original: {
        status: 'IN_ASSESSMENT',
        aiStatus: 'APPROVED',
      } as ClaimRequest,
    }

    if (typeof statusCol?.cell === 'function') {
      const { container } = render(
        // @ts-expect-error test mock cell props
        statusCol.cell({ row: mockRow })
      )
      expect(container.textContent).toContain(
        'claimRequests.status.inAssessment'
      )
      expect(container.textContent).toContain('claimRequests.aiStatus.approved')
    }
  })

  it('renders link to management route in extNationalCode column when id exists', () => {
    const { result } = renderHook(() => useCustomerUserClaimRequestColumns())
    const nationalCodeCol = result.current.find(
      (col) =>
        ('accessorKey' in col ? col.accessorKey : col.id) === 'extNationalCode'
    )
    expect(nationalCodeCol).toBeDefined()

    const mockRow = {
      original: {
        id: 'req-456',
        extNationalCode: '0011223344',
        extMainNationalCode: '0099887766',
      } as ClaimRequest,
    }

    if (typeof nationalCodeCol?.cell === 'function') {
      render(
        // @ts-expect-error test mock cell props
        nationalCodeCol.cell({ row: mockRow })
      )
      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toBe(
        '/customer-user/claim-requests/req-456/claim-request-management'
      )
    }
  })
})
