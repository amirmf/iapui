// @vitest-environment jsdom
import { MyClaimRequestsFilter } from '@features/my-claims/components/my-claim-requests-filter'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

Element.prototype.scrollIntoView = () => {}
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: 'fa' },
  }),
}))
vi.mock('@features/my-claims/queries/use-get-my-insurance-policy', () => ({
  default: () => ({
    data: [
      { id: 7, planId: 1, title: 'Policy A' },
      { id: 8, planId: 1, title: 'Policy B' },
    ],
    isLoading: false,
  }),
}))
vi.mock('@features/my-claims/queries/use-get-my-sub-insured-people', () => ({
  default: () => ({
    data: [
      { id: 1, nationalCode: '0012345678', fullName: 'Person', isForeign: 'Y' },
    ],
    isLoading: false,
  }),
}))
// Exercise real RHF provider/field wiring; only popup controls use deterministic native controls.
vi.mock('@iap/ui', async (original) => {
  const actual = await original<typeof import('@iap/ui')>()
  return {
    ...actual,
    SearchableSelect: (props: {
      value?: string
      onChange: (value?: string) => void
      items: { value: string; label: string }[]
      placeholder?: string
      canClear?: boolean
    }) => (
      <select
        aria-label={props.placeholder}
        value={props.value ?? ''}
        onChange={(event) => props.onChange(event.target.value || undefined)}
      >
        {props.canClear !== false && <option value=''>Clear</option>}
        {props.items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    ),
  }
})
afterEach(cleanup)

describe('MyClaimRequestsFilter mounted form behavior', () => {
  it('defaults policy, uses it for person lookup, and excludes it from submitted filters', async () => {
    const onFilterChange = vi.fn()
    render(<MyClaimRequestsFilter onFilterChange={onFilterChange} />)
    const policy = screen.getByRole('combobox', {
      name: 'Select insurance policy',
    }) as HTMLSelectElement
    await waitFor(() => expect(policy.value).toBe('7'))
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Select sub-insured person' }),
      { target: { value: '0012345678' } }
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.apply' })
    )
    await waitFor(() =>
      expect(onFilterChange).toHaveBeenCalledWith({
        status: undefined,
        extNationalCode: '0012345678',
      })
    )
    expect(
      screen.getByRole('option', {
        name: 'Person (0012345678-claimRequests.dialog.fields.foreign)',
      })
    ).toBeTruthy()
  })

  it('policy changes clear the person, and clear publishes an empty object while retaining policy', async () => {
    const onFilterChange = vi.fn()
    render(
      <MyClaimRequestsFilter
        onFilterChange={onFilterChange}
        initialFilters={{
          extPolicyId: 7,
          extNationalCode: '0012345678',
          status: ['APPROVED'],
        }}
      />
    )
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Select insurance policy' }),
      { target: { value: '8' } }
    )
    expect(
      (
        screen.getByRole('combobox', {
          name: 'Select sub-insured person',
        }) as HTMLSelectElement
      ).value
    ).toBe('')
    fireEvent.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.clear' })
    )
    expect(onFilterChange).toHaveBeenCalledWith({})
    expect(
      (
        screen.getByRole('combobox', {
          name: 'Select insurance policy',
        }) as HTMLSelectElement
      ).value
    ).toBe('8')
    expect(
      screen.queryByRole('button', { name: 'myClaimRequests.filters.clear' })
    ).toBeNull()
  })
  it('clears an actual date-range endpoint through the mounted form adapter', async () => {
    const onFilterChange = vi.fn()
    const user = userEvent.setup()
    render(
      <MyClaimRequestsFilter
        onFilterChange={onFilterChange}
        initialFilters={{ submitDate__from: '2026-10-10' }}
      />
    )
    await user.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.submitDate' })
    )
    await user.click(screen.getByRole('button', { name: 'common.clear' }))
    await user.keyboard('{Escape}')
    await user.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.apply' })
    )
    await waitFor(() =>
      expect(onFilterChange).toHaveBeenCalledWith({
        status: undefined,
        submitDate__from: undefined,
        submitDate__to: undefined,
      })
    )
  })
  it('keeps paid exclusive and switches from paid to an ordinary status', async () => {
    const onFilterChange = vi.fn()
    const user = userEvent.setup()
    render(
      <MyClaimRequestsFilter
        onFilterChange={onFilterChange}
        initialFilters={{ status: ['APPROVED'] }}
      />
    )
    await user.click(
      screen.getByRole('combobox', { name: 'myClaimRequests.filters.status' })
    )
    await user.click(
      screen.getByRole('option', { name: 'claimRequests.status.paid' })
    )
    await user.keyboard('{Escape}')
    await user.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.apply' })
    )
    await waitFor(() =>
      expect(onFilterChange).toHaveBeenLastCalledWith({
        status: ['PAID'],
        extPaymentDate__neq: 'null',
      })
    )
    await user.click(
      screen.getByRole('combobox', { name: 'myClaimRequests.filters.status' })
    )
    await user.click(
      screen.getByRole('option', { name: 'claimRequests.status.rejected' })
    )
    await user.keyboard('{Escape}')
    await user.click(
      screen.getByRole('button', { name: 'myClaimRequests.filters.apply' })
    )
    await waitFor(() =>
      expect(onFilterChange).toHaveBeenLastCalledWith({ status: ['REJECTED'] })
    )
  })
})
