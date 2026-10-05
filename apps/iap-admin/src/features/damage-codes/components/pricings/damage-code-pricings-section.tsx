import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDamageCodePricingColumns } from '@features/damage-codes/components/pricings/damage-code-pricing-columns'
import { DamageCodePricingDataTableToolbar } from '@features/damage-codes/components/pricings/damage-code-pricing-data-table-toolbar'
import { DamageCodePricingDeleteMethodDialog } from '@features/damage-codes/components/pricings/damage-code-pricing-delete-method-dialog'
import { DamageCodePricingFormDialog } from '@features/damage-codes/components/pricings/damage-code-pricing-form-dialog'
import { DamageCodePricingViewDialog } from '@features/damage-codes/components/pricings/damage-code-pricing-view-dialog'
import { useDamageCodeStore } from '@features/damage-codes/context/store/damage-code-store'
import { damageCodePricingService } from '@features/damage-codes/services/damage-code-pricing-service'
import type { DamageCodeSummary } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission } from '@iap/ui'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState, VisibilityState } from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const emptyPricings: never[] = []

export function DamageCodePricingsSection(props: {
  damageCode: DamageCodeSummary | null
}) {
  const { damageCode } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const columns = useDamageCodePricingColumns()
  const [filters, setFilters] = useState<TableFilterSearch>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 40,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const currentPricing = useDamageCodeStore((state) => state.currentPricing)
  const openPricingDialog = useDamageCodeStore(
    (state) => state.openPricingDialog
  )
  const pricingRowSelection = useDamageCodeStore(
    (state) => state.pricingRowSelection
  )
  const setCurrentPricing = useDamageCodeStore(
    (state) => state.setCurrentPricing
  )
  const setOpenPricingDialog = useDamageCodeStore(
    (state) => state.setOpenPricingDialog
  )
  const setPricingRowSelection = useDamageCodeStore(
    (state) => state.setPricingRowSelection
  )
  const canManage = isSuperAdminRole(user?.roles ?? [])
  const apiFilters = useMemo<ApiFilterParams>(
    () => ({
      ...filters,
      damageCodeId: damageCode?.id,
    }),
    [damageCode?.id, filters]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      damageCodePricingService.getPage({
        filters: apiFilters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['damage-code-pricings', 'page', pagination, apiFilters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const pricings = query.data?.content ?? emptyPricings
  const selectedIds = useMemo(
    () =>
      Object.entries(pricingRowSelection)
        .filter(([, selected]) => selected)
        .map(([index]) => pricings[Number(index)]?.id)
        .filter((id): id is string => Boolean(id)),
    [pricingRowSelection, pricings]
  )
  useEffect(() => {
    setPricingRowSelection({})
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [damageCode?.id, setPricingRowSelection])
  useEffect(() => {
    setPricingRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setPricingRowSelection])
  const updateFilters = useCallback(
    (updater: (previous: TableFilterSearch) => TableFilterSearch) => {
      setFilters((previous) => updater(previous))
      setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    },
    []
  )
  const closeDialog = () => {
    setOpenPricingDialog(null)
    window.setTimeout(() => setCurrentPricing(null), 500)
  }

  return (
    <section className='pt-4'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('damageCodePricings.title')}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {damageCode?.id
              ? t('damageCodePricings.selectedDamageCode', {
                  label: damageCode.title
                    ? `${damageCode.code} — ${damageCode.title}`
                    : (damageCode.code ?? damageCode.id),
                })
              : t('damageCodePricings.selectDamageCodeHint')}
          </p>
        </div>
        <div className='flex gap-2'>
          <Permission hasPermission={canManage}>
            <Button
              className='space-x-2 text-destructive'
              disabled={!selectedIds.length}
              onClick={() => setOpenPricingDialog('deleteMethod')}
              variant='outline'
            >
              <Trash2 aria-hidden='true' className='size-[18px]' />
              {t('common.delete')}
            </Button>
          </Permission>
          <Button
            className='space-x-2'
            disabled={query.isLoading}
            onClick={() => void query.refetch()}
            variant='outline'
          >
            <RefreshCw aria-hidden='true' className='size-[18px]' />
            {t('damageCodePricings.refresh')}
          </Button>
          <Button
            className='space-x-2'
            disabled={!damageCode?.id}
            onClick={() => setOpenPricingDialog('create')}
          >
            <Plus aria-hidden='true' className='size-[18px]' />
            {t('damageCodePricings.create')}
          </Button>
        </div>
      </div>
      <div className='-mx-4 overflow-auto px-4 py-1'>
        <DamageCodePricingDataTableToolbar
          onValuesChange={updateFilters}
          values={filters}
        />
        <PaginatedDataTable
          columns={columns}
          columnVisibility={columnVisibility}
          data={pricings}
          emptyStateText={t('damageCodePricings.noResults')}
          hasActiveFilters={Object.keys(filters).length > 0}
          hasCheckboxes={canManage}
          isLoading={query.isLoading}
          onPaginationChange={setPagination}
          onColumnVisibilityChange={setColumnVisibility}
          onRowSelectionChange={setPricingRowSelection}
          pageCount={query.data?.totalPages ?? 0}
          pagination={pagination}
          rowSelection={pricingRowSelection}
          tableWrapperClassName='max-h-60'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
      <DamageCodePricingDeleteMethodDialog
        ids={selectedIds}
        onOpenChange={(open) => {
          if (open) return
          setOpenPricingDialog(null)
          window.setTimeout(() => setPricingRowSelection({}), 300)
        }}
        open={openPricingDialog === 'deleteMethod'}
      />
      <DamageCodePricingFormDialog
        damageCode={damageCode}
        onOpenChange={(open) => !open && closeDialog()}
        open={openPricingDialog === 'create'}
      />
      {currentPricing ? (
        <>
          <DamageCodePricingFormDialog
            damageCode={damageCode}
            onOpenChange={(open) => !open && closeDialog()}
            open={openPricingDialog === 'edit'}
            pricing={currentPricing}
          />
          <DamageCodePricingViewDialog
            onOpenChange={(open) => !open && closeDialog()}
            open={openPricingDialog === 'view'}
            pricing={currentPricing}
          />
        </>
      ) : null}
    </section>
  )
}
