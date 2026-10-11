// @vitest-environment jsdom
import AgentClaimRequestDetailInfoList from '@features/agent-claim-requests/pages/detail/components/agent-claim-request-detail-info-list'
import MyClaimRequestReadonlyItems from '@features/agent-claim-requests/pages/detail/components/my-claim-request-readonly-items'
import { formatDate, formatDateTime } from '@iap/ui'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  data: {} as Record<string, unknown>,
  language: 'en',
}))
vi.mock(
  '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id',
  () => ({
    default: () => ({ data: state.data }),
  })
)
vi.mock('react-i18next', async (original) => ({
  ...(await original<typeof import('react-i18next')>()),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: state.language },
  }),
}))
afterEach(() => {
  cleanup()
  state.language = 'en'
})
const value = (field: string) =>
  screen.getByText(`agent.claimRequests.detail.${field}`).parentElement!

describe('AgentClaimRequestDetailInfoList reference parity', () => {
  it('keeps zero values, trims whitespace, omits missing optional rows and hides missing relation', () => {
    state.data = {
      amount: 0,
      extAge: 0,
      extDisplayName: '  Beneficiary  ',
      extRelationTitle: '  ',
    }
    const { container } = render(<AgentClaimRequestDetailInfoList />)
    expect(value('amount').textContent).toContain('0')
    expect(value('beneficiary').textContent).toContain('Beneficiary')
    expect(value('beneficiary').textContent).not.toContain(' - ')
    expect(value('mobileNumber').textContent).toContain('common.notAvailable')
    expect(value('submitDate').textContent).toContain('common.notAvailable')
    expect(
      screen.queryByText('agent.claimRequests.detail.createdAt')
    ).toBeNull()
    expect(screen.queryByText('agent.claimRequests.detail.docType')).toBeNull()
    expect(container.firstElementChild?.className).toBe(
      'grid grid-cols-1 gap-4 sm:grid-cols-3'
    )
  })

  it('preserves field order, amount grouping, relation, status map and document fallback', () => {
    state.data = {
      extDisplayName: 'Beneficiary',
      extNationalCode: '123',
      extAge: 42,
      extRelationTitle: 'Child',
      extMainDisplayName: 'Main person',
      extMainNationalCode: '456',
      extMainAge: 64,
      extMobileNumber: '0912',
      extPolicyId: ['P1', 'P2'],
      businessKey: 'Key',
      amount: 123456,
      status: 'APPROVED',
      submitDate: '2026-10-11T00:00:00Z',
      createdAt: '2026-10-11T01:30:00Z',
      documents: [{ documentType: 'A' }, { documentType: 'B' }],
    }
    const { container } = render(<AgentClaimRequestDetailInfoList />)
    expect(
      Array.from(container.querySelectorAll('.border-r-2')).map(
        (row) => row.firstElementChild?.textContent
      )
    ).toEqual(
      [
        'beneficiary',
        'amount',
        'status',
        'subInsuredPerson',
        'mobileNumber',
        'submitDate',
        'createdAt',
        'policyNumber',
        'docType',
        'businessKey',
      ].map((field) => `agent.claimRequests.detail.${field}`)
    )
    expect(value('beneficiary').textContent).toContain(' - Child')
    expect(value('amount').textContent).toContain('123,456')
    expect(value('policyNumber').textContent).toContain('P1, P2')
    expect(value('docType').textContent).toContain('A,B')
    expect(
      screen.getByText('claimRequests.status.approved').className
    ).toContain('bg-green-100/30')
    expect(value('submitDate').textContent).toContain(
      formatDate(state.data.submitDate as string, 'PP', {
        language: 'en',
        normalizeTimezone: false,
      })
    )
    expect(value('createdAt').textContent).toContain(
      formatDateTime(state.data.createdAt as string, 'PPpp', {
        language: 'en',
        normalizeTimezone: false,
      })
    )
  })

  it.each([
    ['fa', '1405/07/19'],
    ['en', 'Oct 11, 2026'],
  ])('matches literal source date output for %s', (language, expected) => {
    state.language = language
    state.data = { submitDate: '2026-10-11T00:00:00Z' }
    render(<AgentClaimRequestDetailInfoList />)
    expect(value('submitDate').textContent).toContain(expected)
  })

  it('uses docType ahead of documents and falls back for empty arrays', () => {
    state.data = {
      docType: { docType: 'Selected' },
      documents: [{ documentType: 'Fallback' }],
      extPolicyId: [],
    }
    render(<AgentClaimRequestDetailInfoList />)
    expect(value('docType').textContent).toContain('Selected')
    expect(screen.queryByText('Fallback')).toBeNull()
    expect(value('policyNumber').textContent).toContain('common.notAvailable')
  })
})

it('wraps string readonly values and renders React node values directly', () => {
  const { rerender } = render(
    <MyClaimRequestReadonlyItems
      title='Title'
      value='Text'
      classNameValue='custom'
    />
  )
  expect(screen.getByText('Text').tagName).toBe('P')
  expect(screen.getByText('Text').className).toContain('custom')
  rerender(
    <MyClaimRequestReadonlyItems title='Title' value={<span>Node</span>} />
  )
  expect(screen.getByText('Node').tagName).toBe('SPAN')
  expect(screen.getByText('Node').parentElement).toBe(
    screen.getByText('Title').parentElement
  )
})
