import { useCallback, useMemo, useState } from 'react'

import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
} from '@features/claim-requests/route-adapters/claim-request-feature'
import {
  type ClaimRequestQuickStatus,
  getClaimRequestQuickStatus,
} from '@features/claim-requests/route-adapters/claim-request-filters'
import { parseClaimRequestTableSearch } from '@features/claim-requests/route-adapters/table-search'
import { isDoctorRole, useAuthSession } from '@iap/auth'
import { type TableFilterSearch } from '@shared/tables'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

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

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function useClaimRequestTableSearch() {
  const { user } = useAuthSession()
  const router = useRouter()
  const locationSearch = useLocation({ select: (location) => location.search })
  const search = useMemo(
    () => toSearchRecord(locationSearch as Record<string, unknown>),
    [locationSearch]
  )
  const tableState = useMemo(
    () => parseClaimRequestTableSearch(search),
    [search]
  )
  const apiFilterSearch = useMemo(
    () => ({
      ...tableState.filters,
      sort: search.sort,
      direction: search.direction,
    }),
    [search, tableState.filters]
  )
  const [sorting, setSorting] = useState(() => tableState.sorting)
  const isDoctor = isDoctorRole(user?.roles ?? [])
  const quickStatus = getClaimRequestQuickStatus(tableState.filters, isDoctor)
  const onQuickStatusChange = useCallback(
    (nextQuickStatus: ClaimRequestQuickStatus) => {
      router.navigate({
        replace: true,
        search: (previous: Record<string, unknown>) =>
          toClaimRequestQuickStatusSearch(previous, nextQuickStatus) as never,
        to: './',
      })
    },
    [router]
  )

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, tableState.pagination)
      void router.navigate({
        replace: true,
        to: './',
        search: (previous: Record<string, unknown>) =>
          ({
            ...previous,
            page: String(next.pageIndex + 1),
            size: String(next.pageSize),
          }) as never,
      })
    },
    [router, tableState.pagination]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = resolveUpdater(updater, sorting)
      setSorting(next)
      void router.navigate({
        replace: true,
        to: './',
        search: (previous: Record<string, unknown>) => {
          const search = { ...previous }
          if (next[0]) {
            search.sort = next[0].id
            search.direction = next[0].desc ? 'desc' : 'asc'
          } else {
            delete search.sort
            delete search.direction
          }
          return search as never
        },
      })
    },
    [router, sorting, setSorting]
  )

  return {
    isDoctor,
    onQuickStatusChange,
    quickStatus,
    sorting,
    onPaginationChange,
    onSortingChange,
    tableState,
    apiFilterSearch,
  }
}

export function toClaimRequestQuickStatusSearch(
  previous: Record<string, unknown>,
  status: ClaimRequestQuickStatus
) {
  if (status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS)
    return { [CLAIM_REQUEST_FEATURE_QUERY_KEY]: CLAIM_REQUEST_FEATURES.tickets }
  const next = { ...previous }
  delete next[CLAIM_REQUEST_FEATURE_QUERY_KEY]
  delete next.status
  delete next.extPaymentDate
  delete next.extPaymentDate__neq
  delete next.page
  next.quickStatus = status
  return next
}
