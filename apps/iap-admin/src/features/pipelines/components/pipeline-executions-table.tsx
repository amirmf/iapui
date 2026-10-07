import { useMemo } from 'react'

import { Badge, Button } from '@iap/ui'
import {
  DataTableColumnHeader,
  SimpleDataTable,
  TableActionButton,
  TableActions,
} from '@shared/tables'
import { IconPlayerStop, IconRefresh, IconRotate } from '@tabler/icons-react'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import type { PipelineExecution } from '../data/pipeline-schema'

export type PipelineExecutionsTableProps = {
  executions: PipelineExecution[]
  isLoading: boolean
  isError: boolean
  pendingExecutionId: number | null
  onRetry: () => void
  onStop: (executionId: number) => void
  onRestart: (executionId: number) => void
}

const executionIdKeys = ['executionId', 'id']

function getExecutionId(execution: PipelineExecution): number | null {
  for (const key of executionIdKeys) {
    const value = execution[key]
    if (typeof value === 'number' && Number.isSafeInteger(value)) return value
  }

  return null
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return '—'
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }

  return JSON.stringify(value)
}

function readExecutionValue(execution: PipelineExecution, keys: string[]) {
  for (const key of keys) {
    if (key in execution) return formatValue(execution[key])
  }

  return '—'
}

function statusVariant(status: string) {
  const normalized = status.toUpperCase()
  if (normalized.includes('FAIL') || normalized.includes('STOP')) {
    return 'destructive'
  }
  if (normalized.includes('COMPLETE') || normalized.includes('SUCCESS')) {
    return 'secondary'
  }
  return 'outline'
}

export function PipelineExecutionsTable({
  executions,
  isLoading,
  isError,
  pendingExecutionId,
  onRetry,
  onStop,
  onRestart,
}: PipelineExecutionsTableProps) {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<PipelineExecution, unknown>[]>(
    () => [
      {
        accessorFn: getExecutionId,
        cell: ({ row }) => (
          <span className='font-mono text-xs'>
            {getExecutionId(row.original) ?? '—'}
          </span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.executionId')}
          />
        ),
        id: 'executionId',
      },
      {
        accessorFn: (execution) =>
          readExecutionValue(execution, ['status', 'batchStatus']),
        cell: ({ row }) => {
          const status = readExecutionValue(row.original, [
            'status',
            'batchStatus',
          ])
          return (
            <Badge presentation='reference' variant={statusVariant(status)}>
              {status}
            </Badge>
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.status')}
          />
        ),
        id: 'status',
      },
      {
        accessorFn: (execution) =>
          readExecutionValue(execution, ['startTime', 'startedAt']),
        cell: ({ row }) =>
          readExecutionValue(row.original, ['startTime', 'startedAt']),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.startedAt')}
          />
        ),
        id: 'startedAt',
      },
      {
        accessorFn: (execution) =>
          readExecutionValue(execution, ['endTime', 'endedAt']),
        cell: ({ row }) =>
          readExecutionValue(row.original, ['endTime', 'endedAt']),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.endedAt')}
          />
        ),
        id: 'endedAt',
      },
      {
        cell: ({ row }) => (
          <details className='max-w-80'>
            <summary className='cursor-pointer text-sm text-primary underline-offset-4 hover:underline'>
              {t('pipelines.actions.viewDetails')}
            </summary>
            <pre className='mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-2 text-xs'>
              {JSON.stringify(row.original, null, 2)}
            </pre>
          </details>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.details')}
          />
        ),
        id: 'details',
      },
      {
        cell: ({ row }) => {
          const executionId = getExecutionId(row.original)
          const isPending = pendingExecutionId === executionId
          return (
            <TableActions presentation='reference'>
              <TableActionButton
                disabled={executionId === null || isPending}
                icon={<IconPlayerStop className='size-4' />}
                label={t('pipelines.actions.stop')}
                onClick={() => executionId !== null && onStop(executionId)}
                presentation='reference'
                variant='destructive'
              />
              <TableActionButton
                disabled={executionId === null || isPending}
                icon={<IconRotate className='size-4' />}
                label={t('pipelines.actions.restart')}
                onClick={() => executionId !== null && onRestart(executionId)}
                presentation='reference'
                variant='info'
              />
            </TableActions>
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.actions')}
          />
        ),
        id: 'actions',
        meta: { className: 'w-24' },
      },
    ],
    [onRestart, onStop, pendingExecutionId, t]
  )

  const table = useReactTable({
    columns,
    data: executions,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (execution, index) => String(getExecutionId(execution) ?? index),
  })

  if (isError) {
    return (
      <div
        className='flex items-center gap-3 text-sm text-destructive'
        role='alert'
      >
        <span>{t('pipelines.errors.executions')}</span>
        <Button onClick={onRetry} size='sm' type='button' variant='outline'>
          <IconRefresh aria-hidden='true' className='size-4' />
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  return (
    <SimpleDataTable
      emptyStateText={t('pipelines.emptyExecutions')}
      isLoading={isLoading}
      loadingText={t('pipelines.loadingExecutions')}
      presentation='reference'
      table={table}
      tableWrapperClassName='max-h-[34rem]'
    />
  )
}
