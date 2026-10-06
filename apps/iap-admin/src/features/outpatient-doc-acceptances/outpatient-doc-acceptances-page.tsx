import { useCallback, useState } from 'react'

import { DamageCasesDialog } from '@features/outpatient-doc-acceptances/components/damage-cases-dialog'
import { IssuanceFormDialog } from '@features/outpatient-doc-acceptances/components/issuance-form-dialog'
import { IssuanceViewDialog } from '@features/outpatient-doc-acceptances/components/issuance-view-dialog'
import { OutpatientClaimFormDialog } from '@features/outpatient-doc-acceptances/components/outpatient-claim-form-dialog'
import { OutpatientClaimViewDialog } from '@features/outpatient-doc-acceptances/components/outpatient-claim-view-dialog'
import { OutpatientDocAcceptanceCancelDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-cancel-dialog'
import { useOutpatientDocAcceptanceColumns } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-columns'
import { OutpatientDocAcceptanceDataTableToolbar } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-data-table-toolbar'
import { OutpatientDocAcceptanceDeleteDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-delete-dialog'
import { OutpatientDocAcceptanceDeleteMethodDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-delete-method-dialog'
import { OutpatientDocAcceptanceFormDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-form-dialog'
import { OutpatientDocAcceptanceGenerateAdjustmentDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-generate-adjustment-dialog'
import { OutpatientDocAcceptanceGenerateDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-generate-dialog'
import { OutpatientDocAcceptanceSendDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-send-dialog'
import { OutpatientDocAcceptanceTerminateDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-terminate-dialog'
import { OutpatientDocAcceptanceViewDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-view-dialog'
import { OutpatientDocAcceptancesSurface } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptances-surface'
import { OutpatientDocAcceptanceProvider } from '@features/outpatient-doc-acceptances/context/provider/outpatient-doc-acceptance-provider'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import {
  type OutpatientDocAcceptanceTableSearch,
  parseOutpatientDocAcceptanceTableSearch,
  toOutpatientDocAcceptanceTableSearch,
} from '@features/outpatient-doc-acceptances/route-adapters/table-search'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import type {
  OutpatientDocAcceptance,
  PageOutpatientDocAcceptance,
} from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, cn } from '@iap/ui'
import { PaginatedDataTable, useTableFilterQueryParams } from '@shared/tables'
import {
  IconDownload,
  IconPlus,
  IconRefresh,
  IconRotate,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import type { RowSelectionState, VisibilityState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const EMPTY_OUTPATIENT_DOC_ACCEPTANCES: OutpatientDocAcceptance[] = []

function OutpatientDocAcceptancesContent() {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const search = useRouterState({
    select: (state) =>
      state.location.search as OutpatientDocAcceptanceTableSearch,
  })
  const tableState = useTableFilterQueryParams({
    parse: parseOutpatientDocAcceptanceTableSearch,
    search,
    serialize: toOutpatientDocAcceptanceTableSearch,
  })
  const filters = tableState.filters
  const query = useQuery<PageOutpatientDocAcceptance>({
    queryFn: ({ signal }) =>
      outpatientDocAcceptanceService.getPage({
        filters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['outpatient-doc-acceptances', tableState.pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const columns = useOutpatientDocAcceptanceColumns()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { open, setOpen } = useOutpatientDocAcceptance()
  const reports = query.data?.content ?? EMPTY_OUTPATIENT_DOC_ACCEPTANCES
  const { user } = useAuthSession()
  const isSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const sync = useMutation({
    mutationFn: () => outpatientDocAcceptanceService.syncInqueryStatuses(),
    onSuccess: (count) => {
      toast.success(
        t('outpatientDocAcceptances.messages.syncInqueryStatusesSuccess', {
          count,
        })
      )
      void query.refetch()
    },
    onError: () =>
      toast.error(
        t('outpatientDocAcceptances.messages.syncInqueryStatusesError')
      ),
  })
  const refresh = useCallback(() => void query.refetch(), [query])

  return (
    <OutpatientDocAcceptancesSurface>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('outpatientDocAcceptances.title')}
          </h2>
        </div>
        <div className='flex flex-wrap gap-2'>
          {isSuperAdmin && (
            <Button
              variant='outline'
              className='space-x-2 text-destructive'
              disabled={!Object.keys(rowSelection).length}
              onClick={() => setOpen('deleteMethod')}
            >
              <IconTrash size={18} />
              <span>{t('outpatientDocAcceptances.actions.bulkDelete')}</span>
            </Button>
          )}
          <Button
            className='space-x-2'
            disabled={query.isLoading}
            onClick={refresh}
            variant='outline'
          >
            <IconRefresh
              size={18}
              className={cn(query.isLoading && 'animate-spin')}
            />
            <span>{t('outpatientDocAcceptances.actions.refresh')}</span>
          </Button>
          <Button
            className='space-x-2'
            variant='outline'
            onClick={() => setOpen('generate')}
          >
            <IconDownload size={18} />
            <span>{t('outpatientDocAcceptances.actions.generate')}</span>
          </Button>
          <Button
            variant='outline'
            onClick={() => setOpen('generateAdjustment')}
          >
            <IconDownload size={18} />
            <span>
              {t('outpatientDocAcceptances.actions.generateAdjustment')}
            </span>
          </Button>
          <Button
            variant='outline'
            disabled={sync.isPending}
            onClick={() => sync.mutate()}
          >
            <IconRotate
              size={18}
              className={cn(sync.isPending && 'animate-spin')}
            />
            <span>
              {t('outpatientDocAcceptances.actions.syncInqueryStatuses')}
            </span>
          </Button>
          <Button className='space-x-2' onClick={() => setOpen('create')}>
            <IconPlus size={18} />
            <span>{t('outpatientDocAcceptances.actions.create')}</span>
          </Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <OutpatientDocAcceptanceDataTableToolbar />
        <PaginatedDataTable<OutpatientDocAcceptance>
          columns={columns}
          columnVisibility={columnVisibility}
          data={reports}
          enableSorting
          isLoading={query.isLoading}
          labels={{
            empty: t('outpatientDocAcceptances.messages.noDocAcceptances'),
          }}
          onColumnVisibilityChange={setColumnVisibility}
          onPaginationChange={tableState.onPaginationChange}
          hasCheckboxes
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onSortingChange={tableState.onSortingChange}
          pageCount={query.data?.totalPages ?? 0}
          pagination={tableState.pagination}
          manualFiltering
          sorting={tableState.sorting}
          tableWrapperClassName='max-h-140'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
      <OutpatientDocAcceptanceFormDialog />
      <OutpatientDocAcceptanceViewDialog />
      <OutpatientDocAcceptanceDeleteDialog />
      <OutpatientDocAcceptanceDeleteMethodDialog
        open={open === 'deleteMethod'}
        onOpenChange={() => {
          setOpen(null)
          setTimeout(() => setRowSelection({}), 300)
        }}
        outpatientDocAcceptances={reports}
        rowSelection={rowSelection}
      />
      <OutpatientDocAcceptanceGenerateDialog />
      <OutpatientDocAcceptanceGenerateAdjustmentDialog />
      <OutpatientDocAcceptanceSendDialog />
      <OutpatientDocAcceptanceCancelDialog />
      <OutpatientDocAcceptanceTerminateDialog />
      <OutpatientClaimFormDialog />
      <OutpatientClaimViewDialog />
      <IssuanceFormDialog />
      <IssuanceViewDialog />
      <DamageCasesDialog />
    </OutpatientDocAcceptancesSurface>
  )
}

export function OutpatientDocAcceptancesPage() {
  return (
    <OutpatientDocAcceptanceProvider>
      <OutpatientDocAcceptancesContent />
    </OutpatientDocAcceptanceProvider>
  )
}
