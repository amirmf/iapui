import { useCallback, useMemo, useState } from 'react'

import {
  getTableFilterCount,
  isTableFiltered,
  updateTableFilterValue,
} from '@shared/tables/filter/filter-utils'
import { TableFilterContent } from '@shared/tables/filter/table-filter-content'
import { TableFilterShell } from '@shared/tables/filter/table-filter-shell'
import type {
  TableFilterBaseProps,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import {
  directionQueryParamKey,
  pageNumberQueryParamKey,
  pageSizeQueryParamKey,
  sortQueryParamKey,
} from '@shared/tables/filter/use-sync-query-params-table-filter'
import { useLocation, useRouter } from '@tanstack/react-router'

const defaultControlQueryParamKeys = [
  pageNumberQueryParamKey,
  pageSizeQueryParamKey,
  sortQueryParamKey,
  directionQueryParamKey,
]

export function TableFilterQueryParams(
  props: TableFilterBaseProps & {
    controlQueryParamKeys?: readonly string[]
    ignoreQueryParams?: readonly string[]
    pageQueryParamKey?: string
    resetPageToFirst?: boolean
    showReset?: boolean
  }
) {
  const {
    className,
    controlQueryParamKeys = defaultControlQueryParamKeys,
    defaultVisibleFilterCount = 6,
    ignoreQueryParams = [],
    labels,
    pageQueryParamKey = pageNumberQueryParamKey,
    resetPageToFirst = false,
    showReset = true,
    ...filterProps
  } = props
  const location = useLocation()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const values = location.search as TableFilterValues
  const ignoredIds = useMemo(
    () => [...controlQueryParamKeys, ...ignoreQueryParams],
    [controlQueryParamKeys, ignoreQueryParams]
  )
  const onValueChange = useCallback(
    (id: string, value: TableFilterValue) => {
      router.navigate({
        replace: true,
        search: (previous: TableFilterValues) => {
          const next = updateTableFilterValue(
            previous as TableFilterValues,
            id,
            value
          )
          const page = next[pageQueryParamKey]
          if (
            resetPageToFirst &&
            typeof page === 'string' &&
            Number.isFinite(Number(page)) &&
            Number(page) > 1
          ) {
            next[pageQueryParamKey] = '1'
          } else {
            delete next[pageQueryParamKey]
          }
          return next
        },
        to: './',
      } as never)
    },
    [pageQueryParamKey, resetPageToFirst, router]
  )
  const onReset = useCallback(() => {
    router.navigate({
      replace: true,
      search: (previous: TableFilterValues) =>
        Object.fromEntries(
          Object.entries(previous).filter(([key]) =>
            ignoreQueryParams.includes(key)
          )
        ),
      to: './',
    } as never)
  }, [ignoreQueryParams, router])
  const count = getTableFilterCount(props)
  const filtered = isTableFiltered(values, ignoredIds)

  return (
    <TableFilterShell
      className={className}
      collapseLabel={labels?.collapse}
      expandLabel={labels?.expand}
      expanded={expanded}
      hasMoreFilters={count > defaultVisibleFilterCount}
      isFiltered={showReset && filtered}
      onExpandChange={() => setExpanded((current) => !current)}
      onReset={onReset}
      resetLabel={labels?.reset}
    >
      <TableFilterContent
        {...filterProps}
        defaultVisibleFilterCount={defaultVisibleFilterCount}
        expanded={expanded}
        onValueChange={onValueChange}
        values={values}
      />
    </TableFilterShell>
  )
}
