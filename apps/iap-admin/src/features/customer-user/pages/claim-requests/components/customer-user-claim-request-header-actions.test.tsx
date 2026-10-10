import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerUserClaimRequestHeaderActions } from './customer-user-claim-request-header-actions'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@features/claim-requests', () => ({
  ClaimRequestExportExcelButton: ({ filters }: { filters: unknown }) => (
    <button data-testid='excel-export-btn'>
      export-{JSON.stringify(filters)}
    </button>
  ),
}))

describe('CustomerUserClaimRequestHeaderActions', () => {
  afterEach(() => {
    cleanup()
  })
  it('renders excel button and refresh button', () => {
    const onRefetch = vi.fn()
    render(
      <CustomerUserClaimRequestHeaderActions
        isLoading={false}
        onRefetch={onRefetch}
        filters={{ page: '0', size: '20' }}
      />
    )

    expect(screen.getByTestId('excel-export-btn')).toBeDefined()
    const refreshBtn = screen.getByRole('button', {
      name: 'claimRequests.refresh',
    })
    expect(refreshBtn).toBeDefined()
    expect(refreshBtn.hasAttribute('disabled')).toBe(false)

    fireEvent.click(refreshBtn)
    expect(onRefetch).toHaveBeenCalledTimes(1)
  })

  it('disables refresh button when loading', () => {
    const onRefetch = vi.fn()
    render(
      <CustomerUserClaimRequestHeaderActions
        isLoading={true}
        onRefetch={onRefetch}
        filters={{}}
      />
    )

    const refreshBtn = screen.getByRole('button', {
      name: 'claimRequests.refresh',
    })
    expect(refreshBtn.hasAttribute('disabled')).toBe(true)
  })
})
