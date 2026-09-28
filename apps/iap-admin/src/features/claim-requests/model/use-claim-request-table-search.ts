import { useCallback, useMemo } from 'react'

import { isDoctorRole, useAuthSession } from '@iap/auth'
import {
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
} from '@shared/tables'
import { useRouter } from '@tanstack/react-router'
import { produce } from 'immer'

import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
} from './claim-request-feature'
import {
  type ClaimRequestQuickStatus,
  getClaimRequestQuickStatus,
} from './claim-request-filters'

function toSearchRecord(value: Record<string, unknown>): TableFilterSearch {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, item]) =>
        typeof item === 'string' ||
        (Array.isArray(item) &&
          item.every((entry) => typeof entry === 'string'))
    )
  ) as TableFilterSearch
}

export function useClaimRequestTableSearch() {
  const { user } = useAuthSession()
  const router = useRouter()
  const search = toSearchRecord(
    router.state.location.search as Record<string, unknown>
  )
  const tableState = parseTableFilterSearch(search)
  const sorting = useMemo(
    () =>
      tableState.sorting.length
        ? tableState.sorting
        : [{ desc: false, id: 'createdAt' }],
    [tableState.sorting]
  )
  const isDoctor = isDoctorRole(user?.roles ?? [])
  const quickStatus = getClaimRequestQuickStatus(tableState.filters, isDoctor)
  const onQuickStatusChange = useCallback(
    (nextQuickStatus: ClaimRequestQuickStatus) => {
      router.navigate({
        replace: true,
        search: produce(
          toTableFilterSearch({ ...tableState, sorting }),
          (nextSearch) => {
            if (nextQuickStatus === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS) {
              return {
                [CLAIM_REQUEST_FEATURE_QUERY_KEY]:
                  CLAIM_REQUEST_FEATURES.tickets,
              }
            }

            delete nextSearch[CLAIM_REQUEST_FEATURE_QUERY_KEY]
            delete nextSearch.status
            delete nextSearch.extPaymentDate
            delete nextSearch.extPaymentDate__neq
            delete nextSearch.page
            nextSearch.quickStatus = nextQuickStatus
          }
        ) as never,
        to: './',
      })
    },
    [router, sorting, tableState]
  )

  return { isDoctor, onQuickStatusChange, quickStatus, sorting, tableState }
}
