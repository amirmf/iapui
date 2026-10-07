import { useMemo } from 'react'

import type { ApiFilterParams } from '@iap/shared-lib'
import type { PaginationState } from '@tanstack/react-table'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

import { AgentClaimRequestHeaderActions } from './agent-claim-request-header-actions'

interface AgentClaimRequestsHeaderProps {
  isLoading: boolean
  pagination: PaginationState
  filters: ApiFilterParams
  onRefetch: () => void
}

export function AgentClaimRequestsHeader({
  isLoading,
  pagination,
  filters,
  onRefetch,
}: AgentClaimRequestsHeaderProps) {
  const { t } = useTranslation()

  const exportFilters = useMemo(
    () =>
      produce(filters, (draft) => {
        draft.page = pagination.pageIndex
        draft.size = pagination.pageSize
      }),
    [filters, pagination.pageIndex, pagination.pageSize]
  )

  return (
    <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
      <div>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('agent.claimRequests.title')}
        </h2>
      </div>
      <AgentClaimRequestHeaderActions
        isLoading={isLoading}
        onRefetch={onRefetch}
        filters={exportFilters}
      />
    </div>
  )
}

export default AgentClaimRequestsHeader
