import { type ReactNode, useEffect } from 'react'

import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'

type ClaimRequestProviderProps = {
  children: ReactNode
}

export function ClaimRequestProvider(props: ClaimRequestProviderProps) {
  const { children } = props
  const reset = useClaimRequestStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return children
}
