import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useBranchStore } from '@features/branches/context/store/branch-store'

export function BranchProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useBranchStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return <>{children}</>
}
