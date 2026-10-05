import { useBankAccountStore } from '@features/bank-accounts/context/store/bank-account-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { BankAccountRowActions } from './bank-account-row-actions'

const bankAccount = {
  bankAccountNumber: 'IR820540102680020817909002',
  bankAccountType: 'IBAN' as const,
  id: '8a7cbf00-1892-4d99-9b83-0662c822058e',
  userId: '8a7cbf00-1892-4d99-9b83-0662c822058e',
}

describe('BankAccountRowActions', () => {
  beforeEach(async () => {
    await i18nReady
    useBankAccountStore.getState().reset()
  })

  it('exposes the reference delete action with an accessible name', async () => {
    const user = userEvent.setup()
    render(<BankAccountRowActions row={{ original: bankAccount } as never} />)

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('bankAccounts.actions.delete'),
      })
    )

    expect(useBankAccountStore.getState()).toMatchObject({
      currentRow: bankAccount,
      openDialog: 'delete',
    })
  })
})
