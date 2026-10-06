import { type ReactNode, useEffect } from 'react'

import { useAgreementStore } from '@features/agreements/context/store/agreement-store'

export function AgreementProvider(props: { children: ReactNode }) {
  const reset = useAgreementStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return props.children
}
