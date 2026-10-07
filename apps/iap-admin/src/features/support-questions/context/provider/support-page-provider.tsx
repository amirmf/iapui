import { type ReactNode, useEffect } from 'react'

import { useSupportPageStore } from '../store/support-page-store'

export function SupportPageProvider({ children }: { children: ReactNode }) {
  const reset = useSupportPageStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}

export default SupportPageProvider
