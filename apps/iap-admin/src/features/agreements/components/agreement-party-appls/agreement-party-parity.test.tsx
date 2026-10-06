import type { ReactNode } from 'react'

import { AgreementPartyApplProvider } from '@features/agreements/context/provider/agreement-party-appl-provider'
import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { formatLocalDateTime } from '@iap/shared-lib'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { AgreementPartyApplFormDialog } from './agreement-party-appl-form-dialog'
import { AgreementPartyApplViewDialog } from './agreement-party-appl-view-dialog'

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }))

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ isPending: false, mutate }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-user-account-search-select',
  () => ({
    AgreementUserAccountSearchSelect: (props: {
      value?: string
      onChange: (value: string) => void
    }) => (
      <input
        aria-label='Selected user'
        value={props.value ?? ''}
        onChange={(event) => props.onChange(event.target.value)}
      />
    ),
  })
)

describe('Agreement party reference behavior', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    useAgreementPartyApplStore.getState().reset()
    mutate.mockClear()
  })
  afterEach(() => {
    cleanup()
    useAgreementPartyApplStore.getState().reset()
  })

  it('resets dialog, current row, and selection when its provider unmounts', () => {
    const view = render(
      <AgreementPartyApplProvider>
        {null as ReactNode}
      </AgreementPartyApplProvider>
    )
    useAgreementPartyApplStore.setState({
      openDialog: 'create',
      currentRow: { role: 'OWNER' },
      rowSelection: { 0: true },
    })
    view.unmount()
    expect(useAgreementPartyApplStore.getState()).toMatchObject({
      openDialog: null,
      currentRow: null,
      rowSelection: {},
    })
  })

  it('rejects a non-UUID user with the reference translated validation message', async () => {
    useAgreementPartyApplStore.setState({ openDialog: 'create' })
    render(
      <AgreementPartyApplFormDialog
        agreementIdsCreate={['11111111-1111-4111-8111-111111111111']}
      />
    )
    fireEvent.change(screen.getByLabelText('Selected user'), {
      target: { value: 'not-a-uuid' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agreementPartyAppls.bulkAssign.submit'),
      })
    )
    expect(
      await screen.findByText(
        i18n.t('agreementPartyAppls.validation.userAccountIdRequired')
      )
    ).toBeTruthy()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('guards submission when no valid creation agreement exists', async () => {
    useAgreementPartyApplStore.setState({ openDialog: 'create' })
    render(<AgreementPartyApplFormDialog agreementIdsCreate={[]} />)
    fireEvent.change(screen.getByLabelText('Selected user'), {
      target: { value: '11111111-1111-4111-8111-111111111111' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agreementPartyAppls.bulkAssign.submit'),
      })
    )
    await waitFor(() =>
      expect(
        screen.queryByText(
          i18n.t('agreementPartyAppls.validation.userAccountIdRequired')
        )
      ).toBeNull()
    )
    expect(mutate).not.toHaveBeenCalled()
  })

  it('shows the default role and submits its scalar value', async () => {
    useAgreementPartyApplStore.setState({ openDialog: 'create' })
    render(
      <AgreementPartyApplFormDialog
        agreementIdsCreate={['11111111-1111-4111-8111-111111111111']}
      />
    )
    expect(screen.getByRole('combobox').textContent).toContain(
      i18n.t('agreements.partyAppls.roles.assessmentUser')
    )
    fireEvent.change(screen.getByLabelText('Selected user'), {
      target: { value: '11111111-1111-4111-8111-111111111111' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agreementPartyAppls.bulkAssign.submit'),
      })
    )
    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        role: 'ASSESSMENT_USER',
        userAccountId: '11111111-1111-4111-8111-111111111111',
      })
    )
  })

  it('shows raw role and local PPpp dates with no invented footer action', () => {
    const date = '2026-10-05T10:00:00+03:30'
    useAgreementPartyApplStore.setState({
      openDialog: 'view',
      currentRow: {
        fromDate: date,
        role: 'OWNER',
        userAccountId: '11111111-1111-4111-8111-111111111111',
      },
    })
    render(<AgreementPartyApplViewDialog />)
    expect(screen.getByText('OWNER')).toBeTruthy()
    expect(screen.getByText(formatLocalDateTime(date))).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: i18n.t('common.cancel') })
    ).toBeNull()
  })
})
