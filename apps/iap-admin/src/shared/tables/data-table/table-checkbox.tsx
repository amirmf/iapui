/* eslint-disable react-refresh/only-export-components */
import { Checkbox, cn } from '@iap/ui'
import type { ColumnDef, Row, Table } from '@tanstack/react-table'

export function TableHeaderCheckbox<TData>(props: {
  ariaLabel: string
  className?: string
  table: Table<TData>
}) {
  const { ariaLabel, className, table } = props

  return (
    <Checkbox
      aria-label={ariaLabel}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      className={cn('translate-y-0.5', className)}
      onCheckedChange={(checked) =>
        table.toggleAllPageRowsSelected(Boolean(checked))
      }
    />
  )
}

export function TableRowCheckbox<TData>(props: {
  ariaLabel: string
  className?: string
  row: Row<TData>
}) {
  const { ariaLabel, className, row } = props

  return (
    <Checkbox
      aria-label={ariaLabel}
      checked={row.getIsSelected()}
      className={cn('translate-y-0.5', className)}
      onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
    />
  )
}

export function createSelectColumn<TData>(props: {
  meta?: ColumnDef<TData>['meta']
  selectAllLabel: string
  selectRowLabel: string
}): ColumnDef<TData> {
  const { meta, selectAllLabel, selectRowLabel } = props

  return {
    cell: ({ row }) => (
      <TableRowCheckbox ariaLabel={selectRowLabel} row={row} />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <TableHeaderCheckbox ariaLabel={selectAllLabel} table={table} />
    ),
    id: 'select',
    meta,
  }
}
