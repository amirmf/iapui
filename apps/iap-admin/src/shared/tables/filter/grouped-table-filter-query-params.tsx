import { useCallback, useState } from 'react'

import { cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  directionQueryParamKey,
  isTableFiltered,
  pageNumberQueryParamKey,
  pageSizeQueryParamKey,
  sortQueryParamKey,
  updateTableFilterValue,
} from '@shared/tables/filter/filter-utils'
import { GroupedTableFilterGroup } from '@shared/tables/filter/grouped-table-filter-group'
import { TableFilterShell } from '@shared/tables/filter/table-filter-shell'
import type {
  TableFilterBaseProps,
  TableFilterGroup,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import { useLocation, useRouter } from '@tanstack/react-router'

export type GroupedTableFilterQueryParamsProps = {
  groups: readonly TableFilterGroup[]
  showReset?: boolean
  ignoreQueryParams?: readonly string[]
  defaultVisibleFilterCount?: number
  expandButtonLabel?: string
  collapseButtonLabel?: string
  labels?: TableFilterBaseProps['labels']
  className?: string
  classNameContainer?: string
  presentation?: 'default' | 'reference'
}

export function GroupedTableFilterQueryParams(
  props: GroupedTableFilterQueryParamsProps
) {
  const {
    groups,
    showReset = true,
    ignoreQueryParams = [],
    defaultVisibleFilterCount = 2,
    expandButtonLabel,
    collapseButtonLabel,
    labels,
    className,
    classNameContainer,
    presentation = 'reference',
  } = props
  const { t } = useTranslate()
  const [expanded, setExpanded] = useState(false)
  const [resetRevision, setResetRevision] = useState(0)
  const values = useLocation({
    select: (location) => location.search,
  }) as TableFilterValues
  const router = useRouter()
  const onValueChange = useCallback(
    (id: string, value: TableFilterValue) => {
      void router.navigate({
        to: './',
        replace: true,
        search: (previous: TableFilterValues) => {
          const next = updateTableFilterValue(previous, id, value)
          const page = next[pageNumberQueryParamKey]
          if (
            typeof page === 'string' &&
            Number.isFinite(Number(page)) &&
            Number(page) > 1
          )
            next[pageNumberQueryParamKey] = '1'
          else delete next[pageNumberQueryParamKey]
          return next
        },
      } as never)
    },
    [router]
  )
  const onReset = useCallback(() => {
    setResetRevision((revision) => revision + 1)
    void router.navigate({
      to: './',
      replace: true,
      search: () => ({}),
    } as never)
  }, [router])
  const isFiltered = isTableFiltered(values, [
    pageNumberQueryParamKey,
    pageSizeQueryParamKey,
    sortQueryParamKey,
    directionQueryParamKey,
    ...ignoreQueryParams,
  ])
  return (
    <TableFilterShell
      className={classNameContainer}
      collapseLabel={
        collapseButtonLabel ?? labels?.collapse ?? t('common.collapse')
      }
      expandLabel={expandButtonLabel ?? labels?.expand ?? t('common.more')}
      resetLabel={labels?.reset ?? t('common.resetFilter')}
      expanded={expanded}
      hasMoreFilters={groups.some(
        (group) => group.filters.length > defaultVisibleFilterCount
      )}
      isFiltered={showReset && isFiltered}
      onExpandChange={() => setExpanded((current) => !current)}
      onReset={onReset}
      presentation={presentation}
    >
      <div
        key={resetRevision}
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
          className
        )}
      >
        {groups.map((group) => (
          <GroupedTableFilterGroup
            key={group.id}
            group={group}
            expanded={expanded}
            defaultVisibleFilterCount={defaultVisibleFilterCount}
            values={values}
            onValueChange={onValueChange}
            presentation={presentation}
          />
        ))}
      </div>
    </TableFilterShell>
  )
}
