import { ClaimRequestStatusFilter } from '@features/claim-requests/pages/index/components/claim-request-status-filter'
import { useClaimRequestFilterGroups } from '@features/claim-requests/pages/index/components/use-claim-request-filter-groups'
import type { ClaimRequestQuickStatus } from '@features/claim-requests/pages/index/route-adapters/claim-request-filters'
import { useClaimRequestTableSearch } from '@features/claim-requests/pages/index/route-adapters/use-claim-request-table-search'
import { GroupedTableFilterQueryParams } from '@shared/tables'

type ClaimRequestDataTableToolbarProps = { count?: number; isLoading?: boolean }

export function ClaimRequestDataTableToolbar(
  props: ClaimRequestDataTableToolbarProps
) {
  const { count, isLoading = false } = props
  const { quickStatus, onQuickStatusChange } = useClaimRequestTableSearch()
  return (
    <div className='mb-4'>
      <ClaimRequestGroupedFilters quickStatus={quickStatus} />
      <ClaimRequestStatusFilter
        count={count}
        isLoading={isLoading}
        selectedStatus={quickStatus}
        onStatusChange={onQuickStatusChange}
      />
    </div>
  )
}

/** Shared filter configuration keeps the page composition focused. */
export function ClaimRequestGroupedFilters(props: {
  quickStatus: ClaimRequestQuickStatus
}) {
  const { quickStatus } = props
  const groups = useClaimRequestFilterGroups({ quickStatus })
  return (
    <GroupedTableFilterQueryParams
      groups={groups}
      showReset
      ignoreQueryParams={['quickStatus', 'features']}
      presentation='reference'
    />
  )
}
