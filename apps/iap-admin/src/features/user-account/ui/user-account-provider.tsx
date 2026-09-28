import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useUserAccountStore } from '@features/user-account/model/user-account-store'

export function UserAccountProvider(props: { children: ReactNode }) {
  const { children } = props
  const reset = useUserAccountStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return children
}
