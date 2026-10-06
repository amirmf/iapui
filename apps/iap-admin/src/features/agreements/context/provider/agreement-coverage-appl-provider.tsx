import { type ReactNode, useEffect } from 'react'

import { useAgreementCoverageApplStore } from '@features/agreements/context/store/agreement-coverage-appl-store'

export function AgreementCoverageApplProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useAgreementCoverageApplStore((state) => state.reset)
  useEffect(() => reset, [reset])
  return children
}
