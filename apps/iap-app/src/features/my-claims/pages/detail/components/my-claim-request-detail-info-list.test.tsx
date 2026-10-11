import MyClaimRequestDetailInfoList from '@features/my-claims/pages/detail/components/my-claim-request-detail-info-list'
import MyClaimRequestReadonlyItems from '@features/my-claims/pages/detail/components/my-claim-request-readonly-items'
import type { ClaimRequest } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const query = vi.hoisted(() => ({
  data: undefined as ClaimRequest | undefined,
}))
vi.mock('@features/my-claims/queries/my-claim-request-query', () => ({
  useMyClaimRequestQuery: () => query,
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

afterEach(() => {
  cleanup()
  query.data = undefined
})

function valueFor(field: string) {
  return screen.getByText(`myiap.claimRequest.detail.${field}`).parentElement!
}

describe('MyClaimRequestDetailInfoList reference behavior', () => {
  it('retains zero values, beneficiary details and distinct amount fallbacks', () => {
    query.data = {
      extDisplayName: 'Person',
      extNationalCode: '0123456789',
      extAge: 0,
      extRelationTitle: 'Child',
      extMainDisplayName: 'Main',
      extMainNationalCode: '9876543210',
      extMainAge: '0',
      amount: 1234567,
    }
    render(<MyClaimRequestDetailInfoList />)
    expect(valueFor('beneficiary').textContent).toContain(
      'Person (0123456789) 0 - Child'
    )
    expect(valueFor('subInsuredPerson').textContent).toContain(
      'Main (9876543210) 0'
    )
    expect(valueFor('amount').textContent).toContain('1,234,567')
    expect(valueFor('totalSumAmount').textContent).toBe(
      'myiap.claimRequest.detail.totalSumAmount-'
    )
    expect(valueFor('mobileNumber').textContent).toContain(
      'common.notAvailable'
    )
  })

  it('uses sent-to-bank until the external payment date is present', () => {
    query.data = { status: 'PAID', amount: 0 }
    const view = render(<MyClaimRequestDetailInfoList />)
    expect(valueFor('status').textContent).toContain(
      'claimRequests.status.sentToBank'
    )
    expect(valueFor('amount').textContent).toBe(
      'myiap.claimRequest.detail.amount0'
    )
    query.data = { status: 'PAID', extPaymentDate: '1405/07/18' }
    view.rerender(<MyClaimRequestDetailInfoList />)
    expect(valueFor('status').textContent).toContain(
      'claimRequests.status.paid'
    )
    expect(valueFor('extPaymentDate').textContent).toContain('1405/07/18')
  })

  it('renders all conditional timestamps and uses document types as fallback', () => {
    query.data = {
      submitDate: '2026-10-10T00:00:00Z',
      createdAt: '2026-10-09T00:00:00Z',
      statusHistory: [
        { status: 'APPROVED', timestamp: '2026-10-08T00:00:00Z' },
        { status: 'RETURN', timestamp: '2026-10-07T00:00:00Z' },
        { status: 'PAID', timestamp: '2026-10-06T00:00:00Z' },
      ],
      documents: [{ documentType: 'Invoice' }, { documentType: 'Receipt' }],
    }
    render(<MyClaimRequestDetailInfoList />)
    expect(valueFor('submitDate').textContent).toContain('Oct 10, 2026')
    expect(valueFor('createdAt').textContent).toContain('Oct 9, 2026 03:30')
    expect(valueFor('assessedAt').textContent).toContain('Oct 8, 2026 03:30')
    expect(valueFor('returnedAt').textContent).toContain('Oct 7, 2026 03:30')
    expect(valueFor('paidAt').textContent).toContain('Oct 6, 2026 03:30')
    expect(valueFor('docType').textContent).toContain('Invoice,Receipt')
  })

  it('omits optional rows when absent and prefers the explicit document type', () => {
    const view = render(<MyClaimRequestDetailInfoList />)
    for (const key of [
      'createdAt',
      'assessedAt',
      'returnedAt',
      'paidAt',
      'extPaymentDate',
      'docType',
    ]) {
      expect(screen.queryByText(`myiap.claimRequest.detail.${key}`)).toBeNull()
    }
    query.data = {
      docType: { docType: 'Explicit' },
      documents: [{ documentType: 'Fallback' }],
    }
    view.rerender(<MyClaimRequestDetailInfoList />)
    expect(valueFor('docType').textContent).toContain('Explicit')
    expect(screen.queryByText('Fallback')).toBeNull()
  })
})

describe('MyClaimRequestReadonlyItems reference markup', () => {
  it('wraps strings in a styled paragraph and leaves React nodes intact', () => {
    const view = render(
      <MyClaimRequestReadonlyItems
        title='Label'
        value='Value'
        classNameValue='text-red-700'
      />
    )
    expect(screen.getByText('Value').tagName).toBe('P')
    expect(screen.getByText('Value').className).toContain('text-red-700')
    view.rerender(
      <MyClaimRequestReadonlyItems
        title='Label'
        value={<span data-testid='node'>Node</span>}
      />
    )
    expect(screen.getByTestId('node').parentElement).toBe(
      screen.getByText('Label').parentElement
    )
  })
})
