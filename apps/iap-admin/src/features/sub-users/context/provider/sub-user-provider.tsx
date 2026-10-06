import { type ReactNode, useEffect } from 'react'

import { useSubUserStore } from '../store/sub-user-store'

interface Props {
  children: ReactNode
}

export function SubUserProvider({ children }: Props) {
  const reset = useSubUserStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}

export default SubUserProvider
