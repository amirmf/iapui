import type { ReactNode } from 'react'

import { useClaimRequestColumns } from '@features/claim-requests/components/claim-request-columns'
import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import type { ClaimRequest } from '@iap/api-types'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { roles: [] } }),
  isSuperAdminRole: () => false,
}))
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: { quickStatus: 'ALL' } }),
  Link: (props: {
    children: ReactNode
    className?: string
    onClick?: () => void
    params: { claimRequestId: string }
  }) => {
    const { children, className, onClick, params } = props
    return (
      <a
        href={`/claim-requests/${params.claimRequestId}/claim-request-management/`}
        className={className}
        onClick={(event) => {
          event.preventDefault()
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  },
}))
vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))

function ColumnsFixture(props: { claimRequest: ClaimRequest }) {
  const { claimRequest } = props
  const table = useReactTable({
    columns: useClaimRequestColumns(),
    data: [claimRequest],
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <>
      {table
        .getRowModel()
        .rows[0]!.getVisibleCells()
        .map((cell) => (
          <div data-testid={cell.column.id} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
    </>
  )
}

describe('claim-request column and action reference parity', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })
  beforeEach(() =>
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
  )
  beforeEach(() => useClaimRequestIds.getState().setIds(['claim-1', 'claim-2']))

  it('retains all source columns, formatted amounts, reference badges and click coordination', () => {
    const { container } = render(
      <ColumnsFixture
        claimRequest={{
          id: 'claim-1',
          extNationalCode: '123',
          amount: 1000,
          totalSumAmount: 0,
          baseClaimRequestId: 'base',
          specialDiseases: ['VIP'],
          status: 'IN_ASSESSMENT',
          aiStatus: 'APPROVED',
        }}
      />
    )
    expect(
      Array.from(container.querySelectorAll('[data-testid]')).map((element) =>
        element.getAttribute('data-testid')
      )
    ).toEqual([
      'extNationalCode',
      'extDisplayName',
      'businessKey',
      'docType.id',
      'amount',
      'status',
      'submitDate',
      'latestAssignementDisplayName',
      'extPolicyId',
      'corePaidAmount',
      'corePaidAmountPercent',
      'extWorkUnitName',
      'actions',
    ])
    expect(screen.getByTestId('amount').textContent).toBe(
      '1,0000claimRequests.requestType.adjustment'
    )
    for (const badge of container.querySelectorAll('[data-slot="badge"]')) {
      expect(badge.className).toContain('focus-visible:ring-[3px]')
    }
    expect(
      screen
        .getByRole('button', { name: 'claimRequests.actions.assignToMe' })
        .querySelector('svg')
    ).not.toBeNull()
    expect(container.querySelector('svg.tabler-icon-user-edit')).not.toBeNull()
    fireEvent.click(screen.getByTestId('extNationalCode').querySelector('a')!)
    expect(useClaimRequestIds.getState().ids).toEqual(['claim-2'])
  })

  it('preserves both source links even when the request ID is absent', () => {
    render(<ColumnsFixture claimRequest={{}} />)
    expect(
      screen.getByTestId('extNationalCode').querySelector('a')
    ).not.toBeNull()
    expect(screen.getByTestId('actions').querySelector('a')).not.toBeNull()
    expect(screen.getByTestId('amount').textContent).toBe('--')
  })
})
