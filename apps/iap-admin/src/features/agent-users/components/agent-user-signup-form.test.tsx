import AgentUserSignupPage from '@features/agent-users/agent-user-signup-page'
import { i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ signup: vi.fn(), success: vi.fn() }))
vi.mock('@features/agent-users/services/agent-user-service', () => ({
  default: { signup: mocks.signup },
}))
vi.mock('sonner', () => ({ toast: { success: mocks.success } }))

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const result = render(
    <QueryClientProvider client={client}>
      <AgentUserSignupPage />
    </QueryClientProvider>
  )
  return { ...result, user: userEvent.setup() }
}
async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText('شماره همراه', { exact: false }),
    ' 09123456789 '
  )
  await user.type(
    screen.getByLabelText('کد ملی', { exact: false }),
    ' foreign-id '
  )
  await user.type(screen.getByLabelText('رمز عبور*', { exact: true }), 'secret')
  await user.type(
    screen.getByLabelText('تکرار رمز عبور', { exact: false }),
    'secret'
  )
}

afterEach(cleanup)
beforeEach(async () => {
  await i18nReady
  vi.clearAllMocks()
})
describe('AgentUserSignupPage actual form', () => {
  it('preserves field order, default nationality, and national code when switching', async () => {
    const { container, user } = setup()
    expect(container.querySelector('[data-slot=card-title]')?.tagName).toBe(
      'DIV'
    )
    expect(
      container.querySelector('[data-slot=card-description]')?.tagName
    ).toBe('DIV')
    expect(container.querySelector('[data-slot=tabs]')).not.toBeNull()
    expect(
      [...container.querySelectorAll('input')].map((input) => input.name)
    ).toEqual(['phoneNumber', 'nationalCode', 'password', 'confirmPassword'])
    expect(
      screen.getByRole('tab', { name: 'ایرانی' }).getAttribute('aria-selected')
    ).toBe('true')
    await user.type(screen.getByLabelText('کد ملی', { exact: false }), 'saved')
    await user.click(screen.getByRole('tab', { name: 'اتباع خارجی' }))
    expect(
      (screen.getByLabelText('کد اتباع', { exact: false }) as HTMLInputElement)
        .value
    ).toBe('saved')
  })
  it('renders translated validation and does not send invalid inputs', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام بیمه‌شده' }))
    expect(
      await screen.findByText('شماره همراه ایرانی معتبر وارد کنید.')
    ).toBeDefined()
    expect(screen.getByText('کد ملی الزامی است.')).toBeDefined()
    expect(screen.getByText('کد ملی الزامی است.').hasAttribute('role')).toBe(
      false
    )
    expect(
      screen
        .getByLabelText('شماره همراه', { exact: false })
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(mocks.signup).not.toHaveBeenCalled()
  })
  it('maps trimmed payload, disables pending submit, then resets before success feedback', async () => {
    let resolve!: () => void
    mocks.signup.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    const { user } = setup()
    await fill(user)
    await user.click(screen.getByRole('tab', { name: 'اتباع خارجی' }))
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام بیمه‌شده' }))
    await waitFor(() => expect(mocks.signup).toHaveBeenCalled())
    expect(mocks.signup.mock.calls[0][0]).toEqual({
      phoneNumber: '09123456789',
      nationalCode: 'foreign-id',
      password: 'secret',
      nationalityType: 'FOREIGN',
    })
    expect(
      (
        screen.getByRole('button', {
          name: 'در حال ثبت‌نام...',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    resolve()
    await waitFor(() =>
      expect(mocks.success).toHaveBeenCalledWith(
        'بیمه‌شده با موفقیت ثبت‌نام شد.'
      )
    )
    expect(
      (
        screen.getByLabelText('شماره همراه', {
          exact: false,
        }) as HTMLInputElement
      ).value
    ).toBe('')
    expect(
      screen.getByRole('tab', { name: 'ایرانی' }).getAttribute('aria-selected')
    ).toBe('true')
  })
  it('keeps values on mutation failure without a success toast', async () => {
    mocks.signup.mockRejectedValue(new Error('failure'))
    const { user } = setup()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام بیمه‌شده' }))
    await waitFor(() => expect(mocks.signup).toHaveBeenCalled())
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'ثبت‌نام بیمه‌شده',
          }) as HTMLButtonElement
        ).disabled
      ).toBe(false)
    )
    expect(
      (
        screen.getByLabelText('شماره همراه', {
          exact: false,
        }) as HTMLInputElement
      ).value
    ).toBe(' 09123456789 ')
    expect(mocks.success).not.toHaveBeenCalled()
  })
})
