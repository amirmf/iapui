import { type ReactNode, useEffect } from 'react'

import { useAgentClaimRequestStore } from '../store/agent-claim-request-store'

interface Props {
  children: ReactNode
}

export function AgentClaimRequestProvider({ children }: Props) {
  const reset = useAgentClaimRequestStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}

export default AgentClaimRequestProvider
