import { Button, cn } from '@iap/ui'
import type { Table } from '@tanstack/react-table'

export function DataTableViewOptions<TData>(props: {
  className?: string
  labels?: { toggleColumns?: string; view?: string }
  table: Table<TData>
}) {
  const { className, labels, table } = props
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  if (!columns.length) return null

  return (
    <details className={cn('relative', className)}>
      <summary className='list-none'>
        <Button asChild size='sm' type='button' variant='outline'>
          <span>{labels?.view ?? 'View'}</span>
        </Button>
      </summary>
      <fieldset className='absolute end-0 z-20 mt-2 min-w-48 rounded-lg border border-border bg-surface p-2 shadow-lg'>
        <legend className='sr-only'>
          {labels?.toggleColumns ?? 'Toggle columns'}
        </legend>
        {columns.map((column) => (
          <label
            className='flex min-h-10 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-surface-muted'
            key={column.id}
          >
            <input
              checked={column.getIsVisible()}
              onChange={(event) =>
                column.toggleVisibility(event.target.checked)
              }
              type='checkbox'
            />
            {column.columnDef.meta?.label ?? column.id}
          </label>
        ))}
      </fieldset>
    </details>
  )
}
