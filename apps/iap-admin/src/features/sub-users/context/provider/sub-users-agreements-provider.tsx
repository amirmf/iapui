import { type ReactNode, useEffect } from 'react'

import { useSubUsersAgreementsStore } from '../store/sub-users-agreements-store'

interface Props {
  children: ReactNode
}

export function SubUsersAgreementsProvider({ children }: Props) {
  const reset = useSubUsersAgreementsStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}

export default SubUsersAgreementsProvider
