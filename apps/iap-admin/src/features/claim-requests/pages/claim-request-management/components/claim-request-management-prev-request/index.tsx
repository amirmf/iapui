import { useCallback, useMemo } from 'react'

import { ClaimRequestAttachmentsDialog } from '@features/claim-requests/pages/claim-request-management/components/claim-request-attachments-dialog'
import ClaimRequestManagementPrevRequestFilter from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/claim-request-management-prev-request-filter'
import ClaimRequestManagementPrevRequestTableGuid from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/claim-request-management-prev-request-table-guid'
import useClaimRequestManagementPrevRequestColumns from '@features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/use-claim-request-management-prev-request-columns'
import { useClaimRequestManagementPrevRequestAttachments } from '@features/claim-requests/pages/claim-request-management/context/store/claim-request-management-prev-request-attachments-store'
import { claimRequestManagementService } from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { type ClaimRequest, type ClaimRequestStatus } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Card, CardContent } from '@iap/ui'
import { TableCell, TableRow } from '@iap/ui'
import { useTableFilterState } from '@shared/tables'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { flexRender } from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface ClaimRequestManagementPrevRequestProps {
  userId: string
  claimRequestId: string
  claimRequest?: ClaimRequest
}

function ClaimRequestManagementPrevRequest(
  props: ClaimRequestManagementPrevRequestProps
) {
  const { userId, claimRequestId, claimRequest } = props
  const { t } = useTranslation()
  const {
    pagination,
    onPaginationChange: setPagination,
    filters,
    onFilterValueChange: onChange,
  } = useTableFilterState({
    filters: {} as Record<string, string | string[] | undefined>,
    pagination: { pageIndex: 0, pageSize: 40 },
    sorting: [],
  })
  const columnFilters = useMemo(
    () => Object.entries(filters).map(([id, value]) => ({ id, value })),
    [filters]
  )
  const onColumnFiltersChange = useCallback(
    (
      updater:
        ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      const next =
        typeof updater === 'function'
          ? updater(columnFilters as ColumnFiltersState)
          : updater
      const nextIds = new Set(next.map((item) => item.id))
      columnFilters.forEach((item) => {
        if (!nextIds.has(item.id)) onChange(item.id, undefined)
      })
      next.forEach((item) =>
        onChange(item.id, item.value as string | string[] | undefined)
      )
    },
    [columnFilters, onChange]
  )

  const columns = useClaimRequestManagementPrevRequestColumns()
  const { isOpen } = useClaimRequestManagementPrevRequestAttachments()

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['claimRequests', 'history', userId, pagination, filters],
    queryFn: async ({ signal }) => {
      return await claimRequestManagementService.getHistory({
        userId,
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters: filters as Record<string, string | string[] | undefined>,
        signal,
      })
    },
    enabled: Boolean(userId),
  })

  const allRequests = useMemo(
    () =>
      (data?.content || []).filter((request) => request.id !== claimRequestId),
    [claimRequestId, data?.content]
  )

  return (
    <div className='pb-4'>
      <Card className='py-2'>
        <CardContent className='px-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex flex-wrap gap-4'>
              <h2 className='text-sm font-semibold'>
                {t('claimRequests.history.title')}
              </h2>
              <ClaimRequestManagementPrevRequestTableGuid />
            </div>
            <ClaimRequestManagementPrevRequestFilter
              columnFilters={columnFilters as ColumnFiltersState}
              onColumnFiltersChange={onColumnFiltersChange}
              refetch={refetch}
              isLoading={isLoading || isFetching}
              claimRequest={claimRequest}
            />
          </div>
          <div className='pt-2'>
            <PaginatedDataTable
              presentation='reference'
              columns={columns}
              data={allRequests}
              isLoading={isLoading || isFetching}
              pageCount={data?.totalPages || 0}
              totalCount={data?.totalElements ?? undefined}
              pagination={pagination}
              onPaginationChange={setPagination}
              tableWrapperClassName='max-h-85'
              renderRow={(row) => {
                const status = row.original.status as
                  ClaimRequestStatus | undefined

                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'group/row relative border-b text-right',
                      status === 'RETURN' &&
                        'bg-yellow-100 hover:bg-yellow-200',
                      status === 'REJECTED' && 'bg-red-100 hover:bg-red-200'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              }}
            />
          </div>

          <ClaimRequestAttachmentsDialog isOpen={isOpen === 'prevTable'} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ClaimRequestManagementPrevRequest
