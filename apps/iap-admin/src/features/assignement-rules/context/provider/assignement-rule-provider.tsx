import { type ReactNode, useEffect } from 'react'

import { useAssignementRuleStore } from '@features/assignement-rules/context/store/assignement-rule-store'

export function AssignementRuleProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useAssignementRuleStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}

export default AssignementRuleProvider
