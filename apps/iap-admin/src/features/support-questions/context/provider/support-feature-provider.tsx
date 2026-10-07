import { type ReactNode, useEffect } from 'react'

import { useSupportFeatureStore } from '../store/support-feature-store'

export function SupportFeatureProvider({ children }: { children: ReactNode }) {
  const reset = useSupportFeatureStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}

export default SupportFeatureProvider
