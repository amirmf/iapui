import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useOutpatientDocAcceptanceStore } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'

export function OutpatientDocAcceptanceProvider({
  children,
}: {
  children: ReactNode
}) {
  const reset = useOutpatientDocAcceptanceStore((state) => state.reset)
  useEffect(() => () => reset(), [reset])
  return children
}
