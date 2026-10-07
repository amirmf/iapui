import { useId } from 'react'

import { GroupedTableFilterItem } from '@shared/tables/filter/grouped-table-filter-item'
import type {
  TableFilterGroup,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function GroupedTableFilterGroup(props: {
  group: TableFilterGroup
  expanded: boolean
  defaultVisibleFilterCount: number
  values: TableFilterValues
  onValueChange: (id: string, value: TableFilterValue) => void
  presentation: 'default' | 'reference'
}) {
  const { group, expanded, defaultVisibleFilterCount, ...controlProps } = props
  const titleId = useId()
  const filters = expanded
    ? group.filters
    : group.filters.slice(0, defaultVisibleFilterCount)
  return (
    <section aria-labelledby={titleId} className='min-w-0'>
      <h3
        id={titleId}
        className='mb-3 text-sm font-medium text-muted-foreground'
      >
        {group.title}
      </h3>
      <div className='space-y-2'>
        {filters.map((filter) => (
          <GroupedTableFilterItem
            key={`${filter.type}-${filter.config.id}`}
            filter={filter}
            {...controlProps}
          />
        ))}
      </div>
    </section>
  )
}
