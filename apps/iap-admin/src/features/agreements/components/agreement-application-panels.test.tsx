import { useAgreementCoverageApplStore } from '@features/agreements/context/store/agreement-coverage-appl-store'
import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { AgreementCoverageApplsSection } from './agreement-coverage-appls/agreement-coverage-appls-section'
import { AgreementPartyApplsContent } from './agreement-party-appls/agreement-party-appls-content'

const { paginatedDataTable } = vi.hoisted(() => ({
  paginatedDataTable: vi.fn(
    ({
      onRowSelectionChange,
    }: {
      onRowSelectionChange: (selection: Record<string, boolean>) => void
    }) => (
      <button onClick={() => onRowSelectionChange({ 0: true })} type='button'>
        Select first row
      </button>
    )
  ),
}))

vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-columns',
  () => ({
    useAgreementPartyApplColumns: () => [],
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-data-table-toolbar',
  () => ({
    AgreementPartyApplDataTableToolbar: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-delete-dialog',
  () => ({
    AgreementPartyApplDeleteDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-delete-method-dialog',
  () => ({
    AgreementPartyApplDeleteMethodDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-form-dialog',
  () => ({
    AgreementPartyApplFormDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-bulk-create-dialog',
  () => ({
    AgreementPartyApplBulkCreateDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-party-appls/agreement-party-appl-view-dialog',
  () => ({
    AgreementPartyApplViewDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-columns',
  () => ({
    useAgreementCoverageApplColumns: () => [],
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-form-dialog',
  () => ({
    AgreementCoverageApplFormDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-view-dialog',
  () => ({
    AgreementCoverageApplViewDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-data-table-toolbar',
  () => ({
    AgreementCoverageDataTableToolbar: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-delete-method-dialog',
  () => ({
    AgreementCoverageApplDeleteMethodDialog: (props: { open: boolean }) =>
      props.open ? (
        <div role='dialog'>Delete selected coverage applications</div>
      ) : null,
  })
)
vi.mock('@iap/auth', () => ({
  isSuperAdminRole: () => true,
  useAuthSession: () => ({ user: { roles: ['SUPER_ADMIN'] } }),
}))
vi.mock('@iap/ui', () => ({
  Button: (props: React.ComponentProps<'button'>) => <button {...props} />,
  Input: (props: React.ComponentProps<'input'>) => <input {...props} />,
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('@shared/tables', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@shared/tables')>()),
  PaginatedDataTable: paginatedDataTable,
}))
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ isPending: false, mutate: vi.fn() }),
  useQuery: () => ({
    data: { content: [], totalElements: 0, totalPages: 0 },
    isFetching: false,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

describe('Agreement application panels', () => {
  beforeAll(async () => {
    await i18nReady
  })

  beforeEach(() => {
    paginatedDataTable.mockClear()
    useAgreementPartyApplStore.setState({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
    })
    useAgreementCoverageApplStore.getState().reset()
  })

  afterEach(() => {
    cleanup()
    useAgreementPartyApplStore.setState({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
    })
    useAgreementCoverageApplStore.getState().reset()
  })

  it('disables party application creation until there is an agreement to assign', () => {
    render(
      <AgreementPartyApplsContent
        agreements={[]}
        userAccounts={[]}
        hasCreateButton
      />
    )

    expect(
      (
        screen.getByRole('button', {
          name: i18n.t('common.delete'),
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(
      (
        screen.getByRole('button', {
          name: i18n.t('agreements.partyAppls.add'),
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })

  it('enables bulk deletion after the user selects a party application row', () => {
    render(
      <AgreementPartyApplsContent
        agreements={[{ id: '00000000-0000-4000-8000-000000000001' } as never]}
        userAccounts={[]}
        hasCreateButton
      />
    )

    const deleteButton = screen.getByRole('button', {
      name: i18n.t('common.delete'),
    })
    expect((deleteButton as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Select first row' }))

    expect((deleteButton as HTMLButtonElement).disabled).toBe(false)
  })

  it('keeps coverage deletion disabled with no selected rows, then opens the delete flow for a selected row', () => {
    render(
      <AgreementCoverageApplsSection agreementId='00000000-0000-4000-8000-000000000001' />
    )

    const deleteButton = screen.getByRole('button', {
      name: i18n.t('common.delete'),
    })
    expect((deleteButton as HTMLButtonElement).disabled).toBe(true)
    expect(
      (
        screen.getByRole('button', {
          name: i18n.t('agreementCoverageAppls.create'),
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Select first row' }))
    expect((deleteButton as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(deleteButton)
    expect(screen.getByRole('dialog').textContent).toContain(
      'Delete selected coverage applications'
    )
  })
})
