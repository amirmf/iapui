import { AgreementCoverageApplDeleteMethodDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-delete-method-dialog'
import { AgreementCoverageApplFormDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-form-dialog'
import { AgreementCoverageApplViewDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-view-dialog'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

const {
  create,
  update,
  softDeleteBulk,
  bulkDelete,
  getAgreementPage,
  getCoveragePage,
  getDamagePage,
  toastSuccess,
  deleteProps,
} = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  softDeleteBulk: vi.fn(),
  bulkDelete: vi.fn(),
  getAgreementPage: vi.fn(),
  getCoveragePage: vi.fn(),
  getDamagePage: vi.fn(),
  toastSuccess: vi.fn(),
  deleteProps: vi.fn(),
}))
vi.mock(
  '@features/agreements/services/agreement-coverage-appl-service',
  () => ({
    agreementCoverageApplService: {
      create,
      update,
      softDeleteBulk,
      bulkDelete,
    },
  })
)
vi.mock('@features/agreements/services/agreement-service', () => ({
  agreementService: { getPage: getAgreementPage },
}))
vi.mock('@features/coverages', () => ({
  coverageService: { getPage: getCoveragePage },
}))
vi.mock('@features/damage-codes', () => ({
  damageCodeService: { getPage: getDamagePage },
}))
vi.mock('sonner', () => ({ toast: { success: toastSuccess } }))
vi.mock('@iap/dialogs', () => ({
  DeleteMethodDialog: (props: unknown) => {
    deleteProps(props)
    return null
  },
}))

function client() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}
const currentRow: AgreementCoverageApplFull = {
  id: 'application',
  agreementId: 'agreement',
  coverageDetailId: 'detail',
  coverageGroupId: 'group',
  damageCodeId: 'damage',
  overrideRatio: 2,
  franchisePercentage: null,
  coverageAmount: 100,
  amountPerCase: null,
}

describe('Coverage dialog reference contracts', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    vi.clearAllMocks()
    getAgreementPage.mockResolvedValue({
      content: [{ id: 'agreement', title: 'Agreement' }],
    })
    getCoveragePage.mockResolvedValue({ content: [] })
    getDamagePage.mockResolvedValue({ content: [] })
    create.mockResolvedValue(currentRow)
    update.mockResolvedValue(currentRow)
    softDeleteBulk.mockResolvedValue(undefined)
    bulkDelete.mockResolvedValue(undefined)
  })
  afterEach(cleanup)

  it('preserves the literal reference close fallback and scrollable dialog', () => {
    render(
      <AgreementCoverageApplViewDialog
        open
        onOpenChange={vi.fn()}
        appl={currentRow}
      />
    )
    expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(2)
    expect(screen.getByRole('dialog').classList.contains('max-h-[95vh]')).toBe(
      true
    )
    expect(screen.getByRole('dialog').classList.contains('overflow-auto')).toBe(
      true
    )
  })

  it('does not add clear-date controls absent in the reference form', () => {
    render(
      <QueryClientProvider client={client()}>
        <AgreementCoverageApplFormDialog
          open
          onOpenChange={vi.fn()}
          currentRow={{
            ...currentRow,
            fromDate: '2025-01-15',
            thruDate: '2025-01-16',
          }}
        />
      </QueryClientProvider>
    )
    expect(screen.queryByRole('button', { name: 'Clear date' })).toBeNull()
  })

  it('preserves edit defaults, lookup request types and source update success sequencing without a toast', async () => {
    const queryClient = client()
    vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(
      () => new Promise(() => {})
    )
    const close = vi.fn()
    render(
      <QueryClientProvider client={queryClient}>
        <AgreementCoverageApplFormDialog
          open
          onOpenChange={close}
          currentRow={currentRow}
        />
      </QueryClientProvider>
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.update') })
    )
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith('application', {
        agreementId: 'agreement',
        coverageDetailId: 'detail',
        coverageGroupId: 'group',
        damageCodeId: 'damage',
        overrideRatio: 2,
        franchisePercentage: undefined,
        coverageAmount: 100,
        amountPerCase: undefined,
        fromDate: undefined,
        thruDate: undefined,
      })
    )
    await waitFor(() => expect(close).toHaveBeenCalledWith(false))
    expect(getAgreementPage).toHaveBeenCalledWith(
      expect.objectContaining({ page: 0, size: 20, filters: {} })
    )
    expect(getCoveragePage).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
        size: 20,
        filters: { coverageType: 'DETAIL' },
      })
    )
    expect(getCoveragePage).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
        size: 20,
        filters: { coverageType: 'GROUP' },
      })
    )
    expect(toastSuccess).not.toHaveBeenCalled()
  })

  it('does not invent required coverage and damage lookup values for creation', async () => {
    const close = vi.fn()
    render(
      <QueryClientProvider client={client()}>
        <AgreementCoverageApplFormDialog
          open
          onOpenChange={close}
          defaultAgreementId='agreement'
        />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: i18n.t('common.save') }))
    await waitFor(() =>
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          agreementId: 'agreement',
          coverageDetailId: '',
          coverageGroupId: '',
          damageCodeId: '',
        }),
        expect.anything()
      )
    )
    await waitFor(() => expect(close).toHaveBeenCalledWith(false))
    expect(toastSuccess).not.toHaveBeenCalled()
  })

  it('rejects deletion when selected row IDs cannot be resolved', async () => {
    render(
      <QueryClientProvider client={client()}>
        <AgreementCoverageApplDeleteMethodDialog
          open
          onOpenChange={vi.fn()}
          appls={[]}
          rowSelection={{ 0: true }}
        />
      </QueryClientProvider>
    )
    const props = deleteProps.mock.calls.at(-1)![0] as {
      onDelete: (method: 'soft' | 'hard') => Promise<void>
    }
    await expect(props.onDelete('hard')).rejects.toThrow(
      'No agreement coverage appls selected'
    )
    await expect(props.onDelete('soft')).rejects.toThrow(
      'No agreement coverage appls selected'
    )
    expect(bulkDelete).not.toHaveBeenCalled()
    expect(softDeleteBulk).not.toHaveBeenCalled()
  })

  it.each(['soft', 'hard'] as const)(
    'deletes selected IDs with the source %s success message before invalidation finishes',
    async (method) => {
      const queryClient = client()
      const invalidate = vi
        .spyOn(queryClient, 'invalidateQueries')
        .mockImplementation(() => new Promise(() => {}))
      render(
        <QueryClientProvider client={queryClient}>
          <AgreementCoverageApplDeleteMethodDialog
            open
            onOpenChange={vi.fn()}
            appls={[currentRow, { id: 'other' }]}
            rowSelection={{ 0: true }}
          />
        </QueryClientProvider>
      )
      const props = deleteProps.mock.calls.at(-1)![0] as {
        onDelete: (method: 'soft' | 'hard', date?: string) => Promise<void>
      }
      await props.onDelete(method, '2026-10-06T10:00:00Z')
      if (method === 'soft')
        expect(softDeleteBulk).toHaveBeenCalledWith(
          ['application'],
          '2026-10-06T10:00:00Z'
        )
      else expect(bulkDelete).toHaveBeenCalledWith(['application'])
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['agreement-coverage-appls'],
      })
      expect(toastSuccess).toHaveBeenCalledWith(
        i18n.t(
          method === 'soft'
            ? 'common.softDeleteSuccess'
            : 'common.deleteSuccess'
        )
      )
    }
  )
})
