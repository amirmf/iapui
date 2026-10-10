import type { ComponentProps } from 'react'

import { MyClaimRequestCard } from '@features/my-claims/components/my-claim-request-card'
import { useMyClaimRequestStore } from '@features/my-claims/context/store/my-claim-request-store'
import type { ClaimRequest, ClaimRequestStatus } from '@iap/api-types'
import { TooltipProvider } from '@iap/ui'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: (
    props: ComponentProps<'a'> & { to: string; params: { id: string } }
  ) => {
    const { to, params, ...rest } = props
    return <a href={to.replace('$id', params.id)} {...rest} />
  },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

function renderCard(claim: ClaimRequest) {
  return render(
    <TooltipProvider>
      <MyClaimRequestCard claim={claim} />
    </TooltipProvider>
  )
}

afterEach(() => {
  cleanup()
  useMyClaimRequestStore.getState().reset()
})

describe('MyClaimRequestCard reference behavior', () => {
  it.each<ClaimRequestStatus>([
    'RETURN',
    'REJECTED',
    'IN_ASSESSMENT',
    'DEDICATED_TO_USER',
    'DELEGATED',
  ])('allows deletion for %s', (status) => {
    const claim = { id: 'claim-1', status }
    renderCard(claim)
    fireEvent.click(
      screen.getByRole('button', { name: 'myiap.claimRequest.actions.delete' })
    )
    expect(useMyClaimRequestStore.getState().currentRow).toBe(claim)
    expect(useMyClaimRequestStore.getState().open).toBe('delete')
    expect(
      Boolean(
        screen.queryByText('myiap.claimRequest.detail.completeAttachment')
      )
    ).toBe(status === 'RETURN')
    expect(
      screen
        .getByRole('link', { name: 'myiap.claimRequest.actions.viewDetails' })
        .getAttribute('href')
    ).toBe('/myclaims/claim-1/')
  })

  it('renders the document fallback title and a zero amount', () => {
    renderCard({
      amount: 0,
      extDisplayName: 'Beneficiary',
      documents: [{ documentType: 'Invoice' }, { documentType: 'Receipt' }],
    })
    expect(screen.getByText('Invoice,Receipt')).toBeTruthy()
    expect(screen.getByText('0')).toBeTruthy()
  })

  it('shows the latest non-ENDUSER objection without mutating the original list', () => {
    const objections: NonNullable<ClaimRequest['objections']> = [
      {
        roleType: 'ENDUSER',
        createdAt: '2026-10-10',
        description: 'User objection',
      },
      {
        roleType: 'EXPERT',
        createdAt: '2026-10-08',
        description: 'Older response',
      },
      {
        roleType: 'EXPERT',
        createdAt: '2026-10-09',
        description: 'Latest response',
      },
    ]
    renderCard({ objections })
    expect(screen.getByText('Latest response')).toBeTruthy()
    expect(screen.queryByText('Older response')).toBeNull()
    expect(screen.queryByText('User objection')).toBeNull()
    expect(objections[0].description).toBe('User objection')
  })

  it('shows sentToBank until PAID has an external payment date', () => {
    const { unmount } = renderCard({ status: 'PAID' })
    expect(screen.getByText('claimRequests.status.sentToBank')).toBeTruthy()
    expect(
      screen.queryByRole('button', {
        name: 'myiap.claimRequest.actions.delete',
      })
    ).toBeNull()
    unmount()
    renderCard({ status: 'PAID', extPaymentDate: '2026/10/10' })
    expect(screen.queryByText('claimRequests.status.sentToBank')).toBeNull()
    expect(screen.getByText('2026/10/10')).toBeTruthy()
  })
})
