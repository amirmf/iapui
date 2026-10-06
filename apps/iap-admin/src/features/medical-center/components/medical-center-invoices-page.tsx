import { useMemo, useState } from 'react'

import { useMedicalCenterInvoiceColumns } from '@features/medical-center/components/medical-center-invoice-columns'
import { MedicalCenterInvoiceDeleteDialog } from '@features/medical-center/components/medical-center-invoice-delete-dialog'
import { MedicalCenterInvoiceDetailDialog } from '@features/medical-center/components/medical-center-invoice-detail-dialog'
import { MedicalCenterInvoiceEditDialog } from '@features/medical-center/components/medical-center-invoice-edit-dialog'
import { MedicalCenterInvoiceToolbar } from '@features/medical-center/components/medical-center-invoice-toolbar'
import { MedicalCenterInvoiceUploadDialog } from '@features/medical-center/components/medical-center-invoice-upload-dialog'
import { MedicalCenterInvoiceDialogProvider } from '@features/medical-center/context/provider/medical-center-invoice-dialog-provider'
import { useMedicalCenterInvoices } from '@features/medical-center/queries/medical-center-invoice-query'
import { toMedicalCenterInvoiceListRequest } from '@features/medical-center/route-adapters/table-search'
import { useMedicalCenterInvoiceTableState } from '@features/medical-center/route-adapters/use-medical-center-invoice-table-state'
import { Button, cn } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function MedicalCenterInvoicesPage() {
  return (
    <MedicalCenterInvoiceDialogProvider>
      <MedicalCenterInvoicesPageContent />
    </MedicalCenterInvoiceDialogProvider>
  )
}

function MedicalCenterInvoicesPageContent() {
  const { t } = useTranslation()
  const { pagination, setPagination, filters, sorting, onSortingChange } =
    useMedicalCenterInvoiceTableState()
  const [createOpen, setCreateOpen] = useState(false)
  const request = useMemo(
    () => toMedicalCenterInvoiceListRequest({ filters, pagination, sorting }),
    [filters, pagination, sorting]
  )
  const query = useMedicalCenterInvoices(request)
  const invoices = query.data?.content ?? []
  const columns = useMedicalCenterInvoiceColumns()

  return (
    <Main>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('medicalCenter.title')}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {t('medicalCenter.description')}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            presentation='reference'
            type='button'
            onClick={() => setCreateOpen(true)}
          >
            <IconPlus className='me-2 size-4' />
            {t('medicalCenter.actions.create')}
          </Button>
          <Button
            presentation='reference'
            type='button'
            variant='outline'
            disabled={query.isFetching}
            onClick={() => query.refetch()}
          >
            <IconRefresh
              className={cn('me-2 size-4', query.isFetching && 'animate-spin')}
            />
            {t('medicalCenter.actions.refresh')}
          </Button>
        </div>
      </div>

      {query.isError ? (
        <div
          className='mb-4 flex flex-wrap items-center gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'
          role='alert'
        >
          <span>{t('medicalCenter.messages.listError')}</span>
          <Button
            presentation='reference'
            type='button'
            size='sm'
            variant='outline'
            onClick={() => query.refetch()}
          >
            {t('common.retry')}
          </Button>
        </div>
      ) : null}

      <div className='-mx-4 overflow-auto px-4 py-1'>
        <MedicalCenterInvoiceToolbar />
        <PaginatedDataTable
          presentation='reference'
          columns={columns}
          data={invoices}
          isLoading={query.isLoading}
          pageCount={query.data?.totalPages ?? 0}
          totalCount={query.data?.totalElements ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={onSortingChange}
          manualSorting
          enableSorting
          labels={{ loading: t('medicalCenter.loading') }}
          emptyStateText={t('medicalCenter.empty')}
        />
      </div>

      <MedicalCenterInvoiceUploadDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <MedicalCenterInvoiceDetailDialog />
      <MedicalCenterInvoiceEditDialog />
      <MedicalCenterInvoiceDeleteDialog />
    </Main>
  )
}
