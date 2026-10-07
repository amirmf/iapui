import { useMemo } from 'react'

import { Button, cn } from '@iap/ui'
import { DataTableColumnHeader, SimpleDataTable } from '@shared/tables'
import { IconPlayerPlay } from '@tabler/icons-react'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export type PipelineJobsTableProps = {
  jobs: string[]
  selectedJobName: string | null
  pendingJobName: string | null
  isLoading: boolean
  onSelect: (jobName: string) => void
  onStart: (jobName: string) => void
}

export function PipelineJobsTable({
  jobs,
  selectedJobName,
  pendingJobName,
  isLoading,
  onSelect,
  onStart,
}: PipelineJobsTableProps) {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<string, unknown>[]>(
    () => [
      {
        accessorFn: (jobName) => jobName,
        cell: ({ row }) => {
          const jobName = row.original
          return (
            <Button
              className={cn(
                'h-auto justify-start p-0 font-mono text-sm',
                selectedJobName === jobName
                  ? 'font-semibold text-primary'
                  : 'text-foreground'
              )}
              onClick={() => onSelect(jobName)}
              type='button'
              variant='link'
            >
              {jobName}
            </Button>
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            presentation='reference'
            title={t('pipelines.columns.job')}
          />
        ),
        id: 'job',
      },
      {
        cell: ({ row }) => {
          const jobName = row.original
          return (
            <Button
              disabled={pendingJobName === jobName}
              onClick={() => {
                onStart(jobName)
              }}
              size='sm'
              type='button'
            >
              <IconPlayerPlay aria-hidden='true' className='size-4' />
              {t('pipelines.actions.start')}
            </Button>
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
        meta: { className: 'w-28' },
      },
    ],
    [onSelect, onStart, pendingJobName, selectedJobName, t]
  )

  const table = useReactTable({
    columns,
    data: jobs,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (jobName) => jobName,
  })

  return (
    <SimpleDataTable
      emptyStateText={t('pipelines.emptyJobs')}
      isLoading={isLoading}
      loadingText={t('pipelines.loadingJobs')}
      presentation='reference'
      table={table}
      tableWrapperClassName='max-h-120'
    />
  )
}
