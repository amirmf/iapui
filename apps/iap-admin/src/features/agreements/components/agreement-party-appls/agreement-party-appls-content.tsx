import { useMemo } from 'react'

import { AgreementPartyApplBulkCreateDialog } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-bulk-create-dialog'
import { useAgreementPartyApplColumns } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-columns'
import { AgreementPartyApplDataTableToolbar } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-data-table-toolbar'
import { AgreementPartyApplDeleteDialog } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-delete-dialog'
import { AgreementPartyApplDeleteMethodDialog } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-delete-method-dialog'
import { AgreementPartyApplFormDialog } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-form-dialog'
import { AgreementPartyApplViewDialog } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-view-dialog'
import { AgreementPartyApplsActions } from '@features/agreements/components/agreement-party-appls/agreement-party-appls-actions'
import { AgreementPartyApplsTitle } from '@features/agreements/components/agreement-party-appls/agreement-party-appls-title'
import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import type {
  Agreement,
  AgreementPartyApplFull,
  UserAccount,
} from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable, useTableFilterState } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const EMPTY_APPLICATIONS: AgreementPartyApplFull[] = []
const validId = z.uuid()

interface AgreementPartyApplsContentProps {
  agreements: Agreement[]
  userAccounts: UserAccount[]
  hasCreateButton?: boolean
  hasSmallPagination?: boolean
  tableWrapperClassName?: string
}

export function AgreementPartyApplsContent(
  props: AgreementPartyApplsContentProps
) {
  const {
    agreements = [],
    userAccounts = [],
    hasCreateButton,
    hasSmallPagination,
    tableWrapperClassName,
  } = props
  const { t } = useTranslate()
  const columns = useAgreementPartyApplColumns()
  const rowSelection = useAgreementPartyApplStore((state) => state.rowSelection)
  const setRowSelection = useAgreementPartyApplStore(
    (state) => state.setRowSelection
  )
  const {
    filters,
    pagination,
    onPaginationChange,
    onFiltersChange,
    resetFilters,
  } = useTableFilterState({
    filters: {},
    pagination: { pageIndex: 0, pageSize: 40 },
    sorting: [],
  })
  const agreementIds = useMemo(
    () =>
      agreements.length
        ? (agreements.map((agreement) => agreement.id) as string[])
        : null,
    [agreements]
  )
  const agreementIdsCreate = useMemo(
    () =>
      agreements
        .map((agreement) => agreement.id)
        .filter((id): id is string => validId.safeParse(id).success),
    [agreements]
  )
  const userAccountIds = useMemo(
    () =>
      userAccounts.length ? userAccounts.map((account) => account.id) : null,
    [userAccounts]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      agreementPartyApplService.getPartyApplicationsPageFull({
        agreementId: agreementIds,
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
        userAccountId: userAccountIds,
      }),
    queryKey: [
      'agreement-party-appls',
      agreementIds,
      pagination,
      filters,
      userAccountIds,
    ],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const applications = query.data?.content ?? EMPTY_APPLICATIONS

  return (
    <>
      <main className='flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm sm:px-8 sm:py-8'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <AgreementPartyApplsTitle />
          <AgreementPartyApplsActions
            createDisabled={agreementIdsCreate.length === 0}
            hasCreateButton={hasCreateButton}
            isBulkCreateDisabled={!agreements.length || !userAccounts.length}
            isFetching={query.isFetching}
            onRefetch={() => void query.refetch()}
          />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <AgreementPartyApplDataTableToolbar
            onReset={resetFilters}
            onValuesChange={onFiltersChange}
            values={filters}
          />
          <PaginatedDataTable
            presentation='reference'
            columns={columns}
            data={applications}
            emptyStateText={t('common.noResults')}
            noResultsContent={t('common.noResults')}
            enableSorting={false}
            hasActiveFilters={Object.keys(filters).length > 0}
            hasCheckboxes
            isLoading={query.isFetching}
            labels={{
              loading: t('common.loading' as never),
              empty: t('common.noResults' as never),
            }}
            manualFiltering
            onPaginationChange={onPaginationChange}
            onRowSelectionChange={setRowSelection}
            pageCount={Math.max(query.data?.totalPages ?? 0, 1)}
            pagination={pagination}
            rowSelection={rowSelection}
            smallPagination={hasSmallPagination}
            tableWrapperClassName={tableWrapperClassName}
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
      </main>
      <AgreementPartyApplFormDialog agreementIdsCreate={agreementIdsCreate} />
      <AgreementPartyApplViewDialog />
      <AgreementPartyApplDeleteDialog refetch={() => void query.refetch()} />
      <AgreementPartyApplDeleteMethodDialog applications={applications} />
      <AgreementPartyApplBulkCreateDialog
        agreements={agreements}
        refetch={() => void query.refetch()}
        userAccounts={userAccounts}
      />
    </>
  )
}
