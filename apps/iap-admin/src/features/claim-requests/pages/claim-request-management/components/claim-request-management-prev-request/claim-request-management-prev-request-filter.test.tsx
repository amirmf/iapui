// @vitest-environment jsdom
import ClaimRequestManagementPrevRequestFilter from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/claim-request-management-prev-request-filter'
import type { ClaimRequest } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'

vi.mock('@modules/doc-types', () => ({
  useDocTypesData: { options: () => ({ options: [] }) },
}))
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@shared/tables', () => ({
  TableFilterFacetedFilter: () => <div>faceted</div>,
}))
afterEach(cleanup)

it('national-code buttons preserve doc type and replace the opposite filter', async () => {
  const update = vi.fn()
  render(
    <ClaimRequestManagementPrevRequestFilter
      columnFilters={[
        { id: 'docType.id', value: ['invoice'] },
        { id: 'extNationalCode__neq', value: 'code' },
      ]}
      onColumnFiltersChange={update}
      refetch={vi.fn()}
      claimRequest={{ extNationalCode: 'national' } as ClaimRequest}
    />
  )
  await userEvent
    .setup()
    .click(
      screen.getByRole('button', {
        name: 'claimRequests.filters.primaryInsured',
      })
    )
  expect(
    update.mock.calls[0][0]([
      { id: 'docType.id', value: ['invoice'] },
      { id: 'extNationalCode__neq', value: 'code' },
    ])
  ).toEqual([
    { id: 'docType.id', value: ['invoice'] },
    { id: 'extNationalCode', value: 'national' },
  ])
})

it('disables refresh and national filters while fetching', () => {
  render(
    <ClaimRequestManagementPrevRequestFilter
      columnFilters={[]}
      onColumnFiltersChange={vi.fn()}
      refetch={vi.fn()}
      isLoading
    />
  )
  expect(
    screen
      .getByRole('button', { name: 'claimRequests.refresh' })
      .hasAttribute('disabled')
  ).toBe(true)
  expect(
    screen.getByRole('button', { name: 'common.all' }).hasAttribute('disabled')
  ).toBe(true)
})
