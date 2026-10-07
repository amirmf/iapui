import { ClaimRequestDataTableToolbar } from '@features/claim-requests'
import type { ClaimRequest } from '@iap/api-types'
import { PaginatedDataTable } from '@shared/tables'
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

interface AgentClaimRequestsTableProps {
  columns: ColumnDef<ClaimRequest>[]
  data: ClaimRequest[]
  isLoading: boolean
  isFetching: boolean
  totalElements?: number
  totalPages: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
}

export function AgentClaimRequestsTable({
  columns,
  data,
  isLoading,
  isFetching,
  totalElements,
  totalPages,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: AgentClaimRequestsTableProps) {
  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
      <ClaimRequestDataTableToolbar
        count={totalElements}
        isLoading={isLoading || isFetching}
      />
      <PaginatedDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        pageCount={totalPages}
        totalCount={totalElements ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        manualSorting
        enableSorting
        presentation='reference'
        tableWrapperClassName='max-h-130'
      />
    </div>
  )
}

export default AgentClaimRequestsTable
