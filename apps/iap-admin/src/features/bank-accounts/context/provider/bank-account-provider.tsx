import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useBankAccountStore } from '@features/bank-accounts/context/store/bank-account-store'

export function BankAccountProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useBankAccountStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return children
}
