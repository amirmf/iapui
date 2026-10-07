import { useMemo } from 'react'

import { damageCodeService } from '@features/damage-codes'
import { type DamageCodeStatus, type PageDamageCode } from '@iap/api-types'
import { useQuery } from '@tanstack/react-query'

interface UseDamageCodeSearchDataProps {
  title?: string
  code?: string
  enabled?: boolean
  status?: DamageCodeStatus
}

function useDamageCodeSearchData(props?: UseDamageCodeSearchDataProps) {
  const { title, code, enabled, status } = props || {}
  const queryKey = useMemo(() => {
    const tmp = ['damage-code-options']
    if (title) tmp.push(title)
    if (code) tmp.push(code)
    if (status) tmp.push(status)
    return tmp
  }, [code, status, title])

  return useQuery<PageDamageCode>({
    queryKey,
    queryFn: ({ signal }) =>
      damageCodeService.getPage({
        page: 0,
        size: 20,
        filters: {
          title: title || undefined,
          code: code || undefined,
          status: status || undefined,
        },
        signal,
      }),
    staleTime: 30 * 1000,
    gcTime: 30 * 1000,
    enabled,
  })
}

export default useDamageCodeSearchData
