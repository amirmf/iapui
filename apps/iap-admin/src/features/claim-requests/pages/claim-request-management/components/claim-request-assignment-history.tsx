import { useMemo, useState } from 'react'

import type { ClaimRequest } from '@features/claim-requests/model/claim-request-management-forms'
import { formatDateTime } from '@iap/ui'
import { LongText } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { DataTableColumnHeader } from '@shared/tables'
import { PaginatedDataTable } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'

type AssignmentHistoryItem = NonNullable<
  ClaimRequest['assignmentHistory']
>[number]

interface ClaimRequestAssignmentHistoryProps {
  assignmentHistory?: ClaimRequest['assignmentHistory']
}

export function ClaimRequestAssignmentHistory(
  props: ClaimRequestAssignmentHistoryProps
) {
  const { assignmentHistory } = props
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 40 })
  const [sorting, setSorting] = useState<SortingState>([])

  const items = useMemo(
    () => (assignmentHistory ?? []).filter(Boolean),
    [assignmentHistory]
  )

  const columns = useMemo<ColumnDef<AssignmentHistoryItem, unknown>[]>(
    () => [
      {
        id: 'assignedTo',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.assignment.history.assignedTo')}
          />
        ),
        accessorFn: (row) =>
          row.assignedUserDisplayName ?? row.assignedUserUsername ?? '',
        cell: ({ row }) =>
          row.original.assignedUserDisplayName ??
          row.original.assignedUserUsername ??
          t('common.notAvailable'),
      },
      {
        id: 'assignedBy',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.assignment.history.assignedBy')}
          />
        ),
        accessorFn: (row) =>
          row.assignedByDisplayName ?? row.assignedByUsername ?? '',
        cell: ({ row }) =>
          row.original.assignedByDisplayName ??
          row.original.assignedByUsername ??
          t('common.notAvailable'),
      },
      {
        accessorKey: 'assignedAt',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.assignment.history.assignedAt')}
          />
        ),
        cell: ({ row }) => formatDateTime(row.original.assignedAt),
      },
      {
        accessorKey: 'assignedEndAt',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.assignment.history.assignedEndAt')}
          />
        ),
        cell: ({ row }) => formatDateTime(row.original.assignedEndAt),
      },
      {
        accessorKey: 'description',
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('claimRequests.assignment.history.description')}
          />
        ),
        cell: ({ row }) => (
          <LongText className='max-w-80'>
            {row.original.description || '-'}
          </LongText>
        ),
      },
    ],
    [t]
  )

  if (!items.length) {
    return null
  }

  return (
    <div className='grid space-y-2'>
      <p className='text-xs font-semibold'>
        {t('claimRequests.assignment.history.title')}
      </p>
      <PaginatedDataTable
        presentation='reference'
        columns={columns}
        data={items}
        pageCount={Math.ceil(items.length / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        enableSorting
        manualSorting={false}
        manualPagination={false}
        manualFiltering={false}
        tableWrapperClassName='max-h-85'
        smallPagination
        className='overflow-hidden'
      />
    </div>
  )
}
