import { type ReactNode, useEffect } from 'react'

import { useMyClaimRequestStore } from '@features/my-claims/context/store/my-claim-request-store'

export default function MyClaimRequestProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useMyClaimRequestStore((state) => state.reset)
  useEffect(() => () => reset(), [reset])
  return <>{children}</>
}
