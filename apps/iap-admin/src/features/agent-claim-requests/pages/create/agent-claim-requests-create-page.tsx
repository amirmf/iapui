import { Card, CardContent } from '@iap/ui'
import { useNavigate } from '@tanstack/react-router'

import { AgentClaimRequestForm } from './components'

export function AgentClaimRequestsCreatePage() {
  const navigate = useNavigate()

  return (
    <div className='container mx-auto max-w-3xl pb-5'>
      <Card>
        <CardContent>
          <AgentClaimRequestForm
            onSuccess={() => navigate({ to: '/agent/claim-requests/' })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AgentClaimRequestsCreatePage
