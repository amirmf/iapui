import type { ReactNode } from 'react'

import { AgreementCoverageApplsSection } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appls-section'
import { useAgreementCoverageApplStore } from '@features/agreements/context/store/agreement-coverage-appl-store'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PaginationState, Row } from '@tanstack/react-table'
import {
  act,
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

const { getPage, update, toastSuccess } = vi.hoisted(() => ({
  getPage: vi.fn(),
  update: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock(
  '@features/agreements/services/agreement-coverage-appl-service',
  () => ({
    agreementCoverageApplService: { getPage, update },
  })
)
vi.mock('sonner', () => ({ toast: { success: toastSuccess } }))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { roles: ['SUPER_ADMIN'] } }),
  isSuperAdminRole: () => true,
}))
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
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-delete-method-dialog',
  () => ({
    AgreementCoverageApplDeleteMethodDialog: () => null,
  })
)
vi.mock(
  '@features/agreements/components/agreement-coverage-appls/agreement-coverage-data-table-toolbar',
  () => ({
    AgreementCoverageDataTableToolbar: () => null,
  })
)
vi.mock('@shared/tables', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@shared/tables')>()),
  PaginatedDataTable: (props: {
    data: AgreementCoverageApplFull[]
    enableSorting: boolean
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    rowSelection: Record<string, boolean>
    onRowSelectionChange: (selection: Record<string, boolean>) => void
    renderRow: (row: Row<AgreementCoverageApplFull>) => ReactNode
  }) => (
    <>
      <output data-testid='sorting'>{String(props.enableSorting)}</output>
      <output data-testid='page'>{props.pagination.pageIndex}</output>
      <output data-testid='selection'>
        {Object.keys(props.rowSelection).length}
      </output>
      <button onClick={() => props.onRowSelectionChange({ 0: true })}>
        Select row
      </button>
      <button
        onClick={() =>
          props.onPaginationChange({ ...props.pagination, pageIndex: 1 })
        }
      >
        Next page
      </button>
      <table>
        <tbody>
          {props.data.map((original) =>
            props.renderRow({
              id: original.id,
              original,
              getIsSelected: () => false,
              getVisibleCells: () =>
                [
                  'overrideRatio',
                  'franchisePercentage',
                  'coverageAmount',
                  'amountPerCase',
                  'actions',
                ].map((id) => ({
                  id,
                  column: { id, columnDef: {} },
                  getContext: () => ({}),
                })),
            } as unknown as Row<AgreementCoverageApplFull>)
          )}
        </tbody>
      </table>
    </>
  ),
}))

const row: AgreementCoverageApplFull = {
  id: 'coverage-application',
  agreementId: 'agreement',
  coverageDetailId: 'detail',
  coverageGroupId: 'group',
  damageCodeId: 'damage',
  overrideRatio: 1,
  franchisePercentage: null,
  coverageAmount: 100,
  amountPerCase: 10,
  fromDate: '2026-10-06T10:00:00Z',
}

function mount(agreementId = 'agreement') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrap = (id: string) => (
    <QueryClientProvider client={client}>
      <AgreementCoverageApplsSection agreementId={id} />
    </QueryClientProvider>
  )
  const view = render(wrap(agreementId))
  return {
    ...view,
    client,
    changeAgreement: (id: string) => view.rerender(wrap(id)),
  }
}

describe('Coverage reference lifecycle and inline edits', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.clearAllMocks()
    useAgreementCoverageApplStore.getState().reset()
    getPage.mockResolvedValue({
      content: [row],
      totalElements: 1,
      totalPages: 1,
    })
    update.mockResolvedValue(row)
  })
  afterEach(() => {
    cleanup()
    useAgreementCoverageApplStore.getState().reset()
  })

  it('uses 40 rows and resets pagination and selection when the agreement changes', async () => {
    const view = mount()
    expect(screen.getByTestId('sorting').textContent).toBe('false')
    await waitFor(() =>
      expect(getPage).toHaveBeenCalledWith({
        page: 0,
        size: 40,
        filters: { agreementId: 'agreement' },
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await waitFor(() =>
      expect(screen.getByTestId('page').textContent).toBe('1')
    )
    fireEvent.click(screen.getByRole('button', { name: 'Select row' }))
    expect(screen.getByTestId('selection').textContent).toBe('1')
    view.changeAgreement('other-agreement')
    await waitFor(() =>
      expect(getPage).toHaveBeenCalledWith({
        page: 0,
        size: 40,
        filters: { agreementId: 'other-agreement' },
      })
    )
    expect(screen.getByTestId('selection').textContent).toBe('0')
  })

  it('saves numeric input and clears editing before invalidation finishes', async () => {
    const view = mount()
    await waitFor(() => expect(getPage).toHaveBeenCalled())
    vi.spyOn(view.client, 'invalidateQueries').mockImplementation(
      () => new Promise(() => {})
    )
    act(() => useAgreementCoverageApplStore.getState().setInlineEditRow(row))
    const inputs = await screen.findAllByRole('spinbutton')
    fireEvent.change(inputs[0]!, { target: { value: '2.5' } })
    fireEvent.change(inputs[2]!, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: i18n.t('common.save') }))
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(row.id, {
        agreementId: 'agreement',
        coverageDetailId: 'detail',
        coverageGroupId: 'group',
        damageCodeId: 'damage',
        overrideRatio: 2.5,
        franchisePercentage: undefined,
        coverageAmount: undefined,
        amountPerCase: 10,
        fromDate: new Date(row.fromDate!),
        thruDate: undefined,
      })
    )
    await waitFor(() =>
      expect(useAgreementCoverageApplStore.getState().inlineEditRow).toBeNull()
    )
    expect(toastSuccess).toHaveBeenCalledWith(
      i18n.t('agreementCoverageAppls.messages.updated')
    )
  })

  it.each([
    'agreementId',
    'coverageDetailId',
    'coverageGroupId',
    'damageCodeId',
  ] as const)('refuses inline save without %s', async (missingField) => {
    mount()
    await waitFor(() => expect(getPage).toHaveBeenCalled())
    act(() =>
      useAgreementCoverageApplStore
        .getState()
        .setInlineEditRow({ ...row, [missingField]: null })
    )
    const save = await screen.findByRole('button', {
      name: i18n.t('common.save'),
    })
    fireEvent.click(save)
    await waitFor(() =>
      expect((save as HTMLButtonElement).disabled).toBe(false)
    )
    expect(update).not.toHaveBeenCalled()
    expect(
      useAgreementCoverageApplStore.getState().inlineEditRow
    ).not.toBeNull()
  })

  it('removes invisible inline edits and resets all shared UI state on unmount', async () => {
    const view = mount()
    await waitFor(() => expect(getPage).toHaveBeenCalled())
    act(() =>
      useAgreementCoverageApplStore.setState({
        inlineEditRow: { ...row, id: 'absent' },
        currentRow: row,
        open: 'view',
      })
    )
    await waitFor(() =>
      expect(useAgreementCoverageApplStore.getState().inlineEditRow).toBeNull()
    )
    view.unmount()
    expect(useAgreementCoverageApplStore.getState()).toMatchObject({
      inlineEditRow: null,
      currentRow: null,
      open: null,
    })
  })
})
