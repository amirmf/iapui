import type { ReactNode } from 'react'

type SupportFlowProviderProps = { children: ReactNode }
export function SupportFlowProvider(props: SupportFlowProviderProps) {
  const { children } = props
  return <>{children}</>
}
