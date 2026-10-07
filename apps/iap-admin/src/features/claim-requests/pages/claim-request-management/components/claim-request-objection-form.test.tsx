// @vitest-environment jsdom
import type { Ref, TextareaHTMLAttributes } from 'react'

import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import { ClaimRequestObjectionForm } from '@features/claim-requests/pages/claim-request-management/components/claim-request-objection-form'
import type { AssessmentItem, ClaimRequest } from '@iap/api-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  items: [] as AssessmentItem[],
  submit: vi.fn(),
  navigate: vi.fn(),
}))
vi.mock('@features/assessment-items', () => ({
  useAssessmentItemsData: () => ({ data: state.items }),
}))
vi.mock(
  '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service',
  () => ({ claimRequestManagementService: { submitObjection: state.submit } })
)
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => state.navigate }))
vi.mock(
  '@features/claim-requests/pages/claim-request-management/components/claim-request-return-templates-dialog',
  () => ({ ClaimRequestReturnTemplatesDialog: () => null })
)
vi.mock('@features/repetitive-responses', () => ({
  RepetitiveResponseTextarea: (
    props: TextareaHTMLAttributes<HTMLTextAreaElement> & {
      textareaRef: Ref<HTMLTextAreaElement>
      onValueChange: (value: string) => void
      isBusy: boolean
    }
  ) => {
    const { textareaRef, onValueChange, ...rest } = props
    return (
      <textarea
        {...rest}
        ref={textareaRef}
        onChange={(event) => onValueChange(event.target.value)}
      />
    )
  },
}))
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

function mount(claimRequest: Partial<ClaimRequest> = {}) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const refetch = vi.fn().mockResolvedValue({})
  render(
    <QueryClientProvider client={client}>
      <ClaimRequestObjectionForm
        claimRequestId='claim'
        claimRequest={claimRequest as ClaimRequest}
        refetch={refetch}
      />
    </QueryClientProvider>
  )
  return refetch
}
async function approve(next = false) {
  const user = userEvent.setup()
  await user.click(
    screen.getByRole('button', {
      name: 'claimRequests.status.objections.approved',
    })
  )
  await user.click(
    screen.getByRole('button', {
      name: next
        ? 'claimRequests.dialog.fields.sendReplyNext'
        : 'claimRequests.dialog.fields.sendReply',
    })
  )
}
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  state.items = []
  state.submit.mockReset()
  state.navigate.mockReset()
  useClaimRequestIds.setState({ ids: [] })
})
afterEach(cleanup)

describe('composed claim objection submission', () => {
  it('checks duplicate assessment items before over amount and never submits understood guards', async () => {
    state.items = [
      { damageCode: { code: 'a' }, status: 'APPROVED', amount: 20 },
      { damageCode: { code: 'a' }, status: 'APPROVED', amount: 20 },
    ] as AssessmentItem[]
    mount({ amount: 1, duplicates: [{ id: 'd' }] })
    await approve()
    expect(
      await screen.findByText(
        'claimRequests.confirmations.duplicateAssessmentItems.title'
      )
    ).toBeTruthy()
    expect(state.submit).not.toHaveBeenCalled()
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'common.dialog.confirm' }))
    expect(state.submit).not.toHaveBeenCalled()
    expect(
      screen.queryByText('claimRequests.confirmations.objectionPayment.title')
    ).toBeNull()
  })

  it('opens the over-amount guard without submitting', async () => {
    state.items = [{ status: 'APPROVED', amount: 20 }] as AssessmentItem[]
    mount({ amount: 10 })
    await approve()
    expect(
      await screen.findByText(
        'claimRequests.confirmations.objectionPayment.title'
      )
    ).toBeTruthy()
    expect(state.submit).not.toHaveBeenCalled()
  })

  it('keeps duplicate confirmation open and form values on failure', async () => {
    state.submit.mockRejectedValue(new Error('failure'))
    mount({ duplicates: [{ id: 'd' }] })
    await approve()
    expect(
      await screen.findByText('claimRequests.confirmations.duplicates.title')
    ).toBeTruthy()
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'common.dialog.confirm' }))
    await waitFor(() =>
      expect(state.submit).toHaveBeenCalledWith({
        claimRequestId: 'claim',
        description: 'تایید شده',
        claimRequestStatus: 'APPROVED',
        isCheat: 'N',
      })
    )
    expect(
      screen.getByText('claimRequests.confirmations.duplicates.title')
    ).toBeTruthy()
    expect(state.navigate).not.toHaveBeenCalled()
  })

  it('shifts the source queue and navigates with replacement on successful next submission', async () => {
    useClaimRequestIds.setState({ ids: ['next', 'later'] })
    state.submit.mockResolvedValue({})
    const refetch = mount()
    await approve(true)
    await waitFor(() =>
      expect(state.navigate).toHaveBeenCalledWith({
        to: '/claim-requests/next/claim-request-management',
        replace: true,
      })
    )
    expect(useClaimRequestIds.getState().ids).toEqual(['later'])
    expect(refetch).not.toHaveBeenCalled()
    await act(async () => {})
  })
})
