import { type ReactNode, useEffect } from 'react'

import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'

export function AgreementPartyApplProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useAgreementPartyApplStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return children
}
