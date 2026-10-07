// @vitest-environment jsdom
import { TicketRelatedClaimRequestColumn } from '@features/tickets/components/ticket-detail-sheet/ticket-related-claim-request-column'
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  claim: vi.fn(),
  assessment: vi.fn(),
  loading: true,
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@tanstack/react-query', () => ({
  queryOptions: (options: unknown) => options,
  useQuery: (options: unknown) => {
    state.claim(options)
    return { isLoading: state.loading }
  },
}))
vi.mock('@features/assessment-items', () => ({
  AssessmentItemsCardList: () => null,
  useAssessmentItemsData: (id?: string) => {
    state.assessment(id)
    return {}
  },
}))
vi.mock('@features/claim-requests', () => ({
  ClaimRequestReadonlyInfoList: () => null,
  claimRequestService: {},
}))
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
it('starts the assessment query before claim data arrives and disables both observers when closed', () => {
  const ticket = { claimRequestId: '  related-id  ' }
  const view = render(
    <TicketRelatedClaimRequestColumn isOpen ticket={ticket} />
  )
  expect(state.claim.mock.lastCall![0].enabled).toBe(true)
  expect(state.claim.mock.lastCall![0].queryKey).toEqual([
    'claimRequest',
    'related-id',
  ])
  expect(state.assessment).toHaveBeenLastCalledWith('related-id')
  view.rerender(
    <TicketRelatedClaimRequestColumn isOpen={false} ticket={ticket} />
  )
  expect(state.claim.mock.lastCall![0].enabled).toBe(false)
  expect(state.assessment).toHaveBeenLastCalledWith(undefined)
})
