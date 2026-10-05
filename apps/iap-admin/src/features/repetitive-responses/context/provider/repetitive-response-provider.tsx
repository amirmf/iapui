import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useRepetitiveResponseStore } from '@features/repetitive-responses/context/store/repetitive-response-store'

export function RepetitiveResponseProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useRepetitiveResponseStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return <>{children}</>
}
