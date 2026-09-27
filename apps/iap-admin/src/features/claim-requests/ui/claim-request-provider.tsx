import { type ReactNode, useEffect } from 'react'

import { useClaimRequestStore } from '../model/claim-request-store'

export function ClaimRequestProvider(props: { children: ReactNode }) {
  const reset = useClaimRequestStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return props.children
}
