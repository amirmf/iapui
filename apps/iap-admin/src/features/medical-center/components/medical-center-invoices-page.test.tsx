import { MedicalCenterInvoicesPage } from '@features/medical-center/components/medical-center-invoices-page'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  table: vi.fn(),
  refetch: vi.fn(),
  upload: vi.fn(),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock(
  '@features/medical-center/queries/medical-center-invoice-query',
  () => ({ useMedicalCenterInvoices: mocks.query })
)
vi.mock(
  '@features/medical-center/route-adapters/use-medical-center-invoice-table-state',
  () => ({
    useMedicalCenterInvoiceTableState: () => ({
      pagination: { pageIndex: 2, pageSize: 40 },
      filters: {
        documentNumber: 'INV-1',
        state: 'FAILED',
        ignoredArray: ['x'],
      },
      sorting: [{ id: 'createdAt', desc: true }],
      setPagination: vi.fn(),
      onSortingChange: vi.fn(),
    }),
  })
)
vi.mock(
  '@features/medical-center/components/medical-center-invoice-columns',
  () => ({ useMedicalCenterInvoiceColumns: () => [] })
)
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: (props: unknown) => {
    mocks.table(props)
    return <div>table</div>
  },
}))
vi.mock(
  '@features/medical-center/components/medical-center-invoice-toolbar',
  () => ({ MedicalCenterInvoiceToolbar: () => <div>toolbar</div> })
)
vi.mock(
  '@features/medical-center/components/medical-center-invoice-upload-dialog',
  () => ({
    MedicalCenterInvoiceUploadDialog: (props: { open: boolean }) => {
      mocks.upload(props)
      return props.open ? <div>upload-open</div> : null
    },
  })
)
vi.mock(
  '@features/medical-center/components/medical-center-invoice-detail-dialog',
  () => ({ MedicalCenterInvoiceDetailDialog: () => null })
)
vi.mock(
  '@features/medical-center/components/medical-center-invoice-edit-dialog',
  () => ({ MedicalCenterInvoiceEditDialog: () => null })
)
vi.mock(
  '@features/medical-center/components/medical-center-invoice-delete-dialog',
  () => ({ MedicalCenterInvoiceDeleteDialog: () => null })
)

afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  mocks.query.mockReturnValue({
    data: { content: [], totalPages: 5, totalElements: 190 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: mocks.refetch,
  })
})
describe('reference invoice page composition', () => {
  it('normalizes source scalar filters and forwards pagination metadata', () => {
    render(<MedicalCenterInvoicesPage />)
    expect(mocks.query).toHaveBeenCalledWith({
      page: 2,
      size: 40,
      sort: 'createdAt',
      direction: 'DESC',
      filters: { documentNumber: 'INV-1', state: 'FAILED' },
    })
    expect(mocks.table).toHaveBeenCalledWith(
      expect.objectContaining({
        pageCount: 5,
        totalCount: 190,
        manualSorting: true,
        enableSorting: true,
        emptyStateText: 'medicalCenter.empty',
      })
    )
    fireEvent.click(screen.getByText('medicalCenter.actions.create'))
    expect(screen.getByText('upload-open')).toBeTruthy()
  })
  it('disables refresh during fetching and offers retry on list failure', () => {
    mocks.query.mockReturnValue({
      isLoading: false,
      isFetching: true,
      isError: true,
      refetch: mocks.refetch,
    })
    render(<MedicalCenterInvoicesPage />)
    expect(
      screen.getByText('medicalCenter.actions.refresh').closest('button')
        ?.disabled
    ).toBe(true)
    expect(screen.getByRole('alert').textContent).toContain(
      'medicalCenter.messages.listError'
    )
    fireEvent.click(screen.getByText('common.retry'))
    expect(mocks.refetch).toHaveBeenCalledOnce()
  })
})
