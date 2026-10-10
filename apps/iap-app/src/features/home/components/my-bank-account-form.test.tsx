import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { bankAccountService } from '../services/bank-account-service'
import { MyBankAccountForm } from './my-bank-account-form'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../services/bank-account-service', () => ({
  bankAccountService: {
    getMyBankAccount: vi.fn(),
    addMyBankAccount: vi.fn(),
    editMyBankAccount: vi.fn(),
  },
}))

describe('MyBankAccountForm', () => {
  it('renders input field and submit button', async () => {
    vi.mocked(bankAccountService.getMyBankAccount).mockResolvedValueOnce({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      bankAccountNumber: '',
      bankAccountType: 'IBAN',
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MyBankAccountForm />
      </QueryClientProvider>
    )

    expect(screen.getByText('myiap.myBankAccount.fields.number')).toBeTruthy()

    expect(
      screen.getByRole('button', { name: 'myiap.myBankAccount.actions.create' })
    ).toBeTruthy()
  })

  it('populates with existing bank account and shows edit button', async () => {
    vi.mocked(bankAccountService.getMyBankAccount).mockResolvedValueOnce({
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      bankAccountNumber: '820120000000000000000000',
      bankAccountType: 'IBAN',
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MyBankAccountForm />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'myiap.myBankAccount.actions.edit' })
      ).toBeTruthy()
    })
  })
})
