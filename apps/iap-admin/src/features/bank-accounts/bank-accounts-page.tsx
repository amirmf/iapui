import { useMemo } from 'react'

import { BankAccountBulkDeleteDialog } from '@features/bank-accounts/components/bank-account-bulk-delete-dialog'
import { useBankAccountColumns } from '@features/bank-accounts/components/bank-account-columns'
import { BankAccountDataTableToolbar } from '@features/bank-accounts/components/bank-account-data-table-toolbar'
import { BankAccountDeleteDialog } from '@features/bank-accounts/components/bank-account-delete-dialog'
import { BankAccountHeaderActions } from '@features/bank-accounts/components/bank-account-header-actions'
import { BankAccountsPageSurface } from '@features/bank-accounts/components/bank-accounts-page-surface'
import { BankAccountProvider } from '@features/bank-accounts/context/provider/bank-account-provider'
import { useBankAccountStore } from '@features/bank-accounts/context/store/bank-account-store'
import { useBankAccountsData } from '@features/bank-accounts/queries/use-bank-accounts-data'
import {
  parseBankAccountTableSearch,
  toBankAccountApiFilters,
  toBankAccountTableSearch,
} from '@features/bank-accounts/route-adapters/table-search'
import type { BankAccount } from '@iap/api-types'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const EMPTY_BANK_ACCOUNTS: BankAccount[] = []

function BankAccountsContent() {
  const { t } = useTranslation()
  const location = useLocation()
  const currentRow = useBankAccountStore((state) => state.currentRow)
  const rowSelection = useBankAccountStore((state) => state.rowSelection)
  const setRowSelection = useBankAccountStore((state) => state.setRowSelection)
  const tableState = useTableFilterQueryParams({
    parse: parseBankAccountTableSearch,
    search: location.search as TableFilterSearch,
    serialize: toBankAccountTableSearch,
  })
  const filters = useMemo(
    () => toBankAccountApiFilters(tableState.filters, tableState.sorting),
    [tableState.filters, tableState.sorting]
  )
  const query = useBankAccountsData({
    filters,
    pagination: tableState.pagination,
  })
  const columns = useBankAccountColumns()
  const bankAccounts = query.data?.content ?? EMPTY_BANK_ACCOUNTS
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => bankAccounts[Number(rowId)]?.id)
        .filter((id): id is string => Boolean(id)),
    [bankAccounts, rowSelection]
  )

  return (
    <>
      <div className='pb-4'>
        <BankAccountsPageSurface>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold tracking-tight'>
                {t('bankAccounts.title')}
              </h2>
            </div>
            <BankAccountHeaderActions
              bankAccountIds={selectedIds}
              bankAccounts={bankAccounts}
              isLoading={query.isLoading || query.isFetching}
              onRefetch={query.refetch}
            />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <BankAccountDataTableToolbar />
            <PaginatedDataTable<BankAccount>
              columns={columns}
              data={bankAccounts}
              enableSorting
              hasCheckboxes
              isLoading={query.isLoading}
              manualSorting
              onPaginationChange={tableState.onPaginationChange}
              onRowSelectionChange={setRowSelection}
              onSortingChange={tableState.onSortingChange}
              pageCount={query.data?.totalPages ?? 0}
              pagination={tableState.pagination}
              rowSelection={rowSelection}
              sorting={tableState.sorting}
              tableWrapperClassName='max-h-130'
              totalCount={query.data?.totalElements ?? 0}
            />
          </div>
        </BankAccountsPageSurface>
      </div>
      <BankAccountBulkDeleteDialog
        bankAccountIds={selectedIds}
        refetch={query.refetch}
      />
      {currentRow ? <BankAccountDeleteDialog refetch={query.refetch} /> : null}
    </>
  )
}

export function BankAccountsPage() {
  return (
    <BankAccountProvider>
      <BankAccountsContent />
    </BankAccountProvider>
  )
}
