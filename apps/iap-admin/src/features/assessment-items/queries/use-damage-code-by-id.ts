import { useMemo } from 'react'

import { damageCodeService } from '@features/damage-codes'
import { useQuery } from '@tanstack/react-query'

interface UseDamageCodeByIdProps {
  damageCodeId?: string | null
  enabled?: boolean
}

function useDamageCodeById(props: UseDamageCodeByIdProps) {
  const { damageCodeId, enabled } = props
  const queryKey = useMemo(() => {
    const tmp: string[] = ['damage-codes', 'by-id']
    if (damageCodeId) {
      tmp.push(damageCodeId)
    }
    return tmp
  }, [damageCodeId])

  return useQuery({
    queryKey: queryKey,
    queryFn: ({ signal }) =>
      damageCodeId
        ? damageCodeService.getById(damageCodeId ?? '', signal)
        : null,
    enabled: !!damageCodeId && !!enabled,
    staleTime: 30000,
    gcTime: 30000,
  })
}

export default useDamageCodeById
