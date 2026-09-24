/* eslint-disable react-refresh/only-export-components */
import { cn } from '@iap/ui'
import type { ColumnDef, Row, Table } from '@tanstack/react-table'

type CheckboxProps = {
  checked: boolean | 'indeterminate'
  className?: string
  label: string
  onCheckedChange: (checked: boolean) => void
}

function SelectionCheckbox(props: CheckboxProps) {
  const { checked, className, label, onCheckedChange } = props

  return (
    <input
      aria-label={label}
      checked={checked === true}
      className={cn('size-4 accent-primary', className)}
      onChange={(event) => onCheckedChange(event.target.checked)}
      ref={(element) => {
        if (element) element.indeterminate = checked === 'indeterminate'
      }}
      type='checkbox'
    />
  )
}

export function TableHeaderCheckbox<TData>(props: {
  ariaLabel: string
  className?: string
  table: Table<TData>
}) {
  const { ariaLabel, className, table } = props

  return (
    <SelectionCheckbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      className={className}
      label={ariaLabel}
      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
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
    <SelectionCheckbox
      checked={row.getIsSelected()}
      className={className}
      label={ariaLabel}
      onCheckedChange={(checked) => row.toggleSelected(checked)}
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
