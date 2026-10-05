// @vitest-environment jsdom
import type { PropsWithChildren, ReactNode } from 'react'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import OtpPage from './otp-page'

vi.mock('@iap/ui', () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
  cn: (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(' '),
  formatDateTime: (value: string | null | undefined) => value,
}))

vi.mock('@shared/tables', () => ({
  DataTableColumnHeader: ({ title }: { title: string }) => <span>{title}</span>,
  PaginatedDataTable: ({
    columns,
    emptyStateText,
  }: {
    columns: { accessorKey?: string }[]
    emptyStateText: ReactNode
  }) => (
    <div>
      {columns.map((column) => (
        <span key={column.accessorKey}>{column.accessorKey}</span>
      ))}
      <span>{emptyStateText}</span>
    </div>
  ),
  TableFilterState: ({
    textFilters,
  }: {
    textFilters: { id: string; placeholder?: string }[]
  }) => (
    <div>
      {textFilters.map((filter) => (
        <input key={filter.id} placeholder={filter.placeholder} />
      ))}
    </div>
  ),
  useTableFilterState: () => ({
    filters: {},
    onFilterValueChange: vi.fn(),
    onPaginationChange: vi.fn(),
    onSortingChange: vi.fn(),
    pagination: { pageIndex: 0, pageSize: 40 },
    resetFilters: vi.fn(),
    sorting: [],
  }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { content: [], totalElements: 0, totalPages: 0 },
    isFetching: false,
    isLoading: false,
    refetch: vi.fn(),
  }),
}))

vi.mock('@tabler/icons-react', () => ({ IconRefresh: () => <svg /> }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(cleanup)

describe('OtpPage', () => {
  it('renders both reference OTP lists with their columns, filters, empty states, and refresh controls', () => {
    render(<OtpPage />)

    expect(screen.getByText('otp.sections.signupOtp')).not.toBeNull()
    expect(screen.getByText('otp.sections.passwordResetOtp')).not.toBeNull()
    expect(screen.getAllByText('common.refresh')).toHaveLength(2)
    expect(
      screen.getAllByPlaceholderText('otp.filters.phoneNumber')
    ).toHaveLength(2)
    expect(
      screen.getAllByPlaceholderText('otp.filters.nationalCode')
    ).toHaveLength(2)
    expect(screen.getByText('otp.empty.signupOtp')).not.toBeNull()
    expect(screen.getByText('otp.empty.passwordResetOtp')).not.toBeNull()
    expect(screen.getAllByText('otpHash')).toHaveLength(2)
    expect(screen.getByText('username')).not.toBeNull()
  })
})
