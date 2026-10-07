import { ClaimRequestExportExcelButton } from '@features/claim-requests'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { IconRefresh } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import agentClaimRequestService from '../../../services/agent-claim-request-service'

interface AgentClaimRequestHeaderActionsProps {
  isLoading: boolean
  onRefetch: () => void
  filters: ApiFilterParams
}

export function AgentClaimRequestHeaderActions(
  props: AgentClaimRequestHeaderActionsProps
) {
  const { isLoading, onRefetch, filters } = props
  const { t } = useTranslation()

  return (
    <div className='flex flex-wrap gap-2'>
      <Button presentation='reference' disabled={isLoading} asChild>
        <Link to='/agent/claim-requests/create/'>
          {t('agent.claimRequests.create.title')}
        </Link>
      </Button>
      <ClaimRequestExportExcelButton
        filters={filters}
        exportExcel={agentClaimRequestService.exportPageLiteExcel}
      />
      <Button
        presentation='reference'
        variant='outline'
        onClick={onRefetch}
        disabled={isLoading}
        className='space-x-2'
      >
        <IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />
        <span>{t('agent.claimRequests.refresh')}</span>
      </Button>
    </div>
  )
}

export default AgentClaimRequestHeaderActions
