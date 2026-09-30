import { type ReactNode, useMemo, useState } from 'react'

import {
  DataTablePagination,
  type DataTablePaginationLabels,
} from '@shared/tables/data-table/data-table-pagination'
import { SimpleDataTable } from '@shared/tables/data-table/simple-data-table'
import { createSelectColumn } from '@shared/tables/data-table/table-checkbox'
import type {
  DataTableLabels,
  DataTableRowLayout,
} from '@shared/tables/data-table/types'
import {
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableOptions,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type AnyValueColumnDef<TData> = TableOptions<TData>['columns'][number]

export function PaginatedDataTable<TData>(props: {
  caption?: ReactNode
  className?: string
  columnFilters?: ColumnFiltersState
  // Use TanStack's own heterogeneous-column contract so accessor columns can
  // retain their individual value types.
  columns: readonly AnyValueColumnDef<TData>[]
  data: readonly TData[]
  emptyContent?: ReactNode
  /** Alias for reference-project usage. */
  emptyStateText?: ReactNode
  enableSorting?: boolean
  hasActiveFilters?: boolean
  hasCheckboxes?: boolean
  isLoading?: boolean
  labels?: DataTableLabels
  manualFiltering?: boolean
  manualPagination?: boolean
  manualSorting?: boolean
  noResultsContent?: ReactNode
  onColumnFiltersChange?: (updater: Updater<ColumnFiltersState>) => void
  onColumnVisibilityChange?: (updater: Updater<VisibilityState>) => void
  onPaginationChange: (updater: Updater<PaginationState>) => void
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void
  onSortingChange?: (updater: Updater<SortingState>) => void
  pageCount: number
  pagination: PaginationState
  paginationLabels?: DataTablePaginationLabels
  pageSizeOptions?: readonly number[]
  renderToolbar?: (table: Table<TData>) => ReactNode
  renderRow?: (row: Row<TData>) => ReactNode
  rowLayout?: DataTableRowLayout
  rowSelection?: RowSelectionState
  selectAllLabel?: string
  selectRowLabel?: string
  smallPagination?: boolean
  sorting?: SortingState
  tableBodyClassName?: string
  tableWrapperClassName?: string
  totalCount?: number
  columnVisibility?: VisibilityState
}) {
  const {
    caption,
    className,
    columnFilters,
    columns,
    data,
    emptyContent,
    emptyStateText,
    enableSorting = true,
    hasActiveFilters = false,
    hasCheckboxes = false,
    isLoading = false,
    labels,
    manualFiltering = true,
    manualPagination = true,
    manualSorting = true,
    noResultsContent,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onPaginationChange,
    onRowSelectionChange,
    onSortingChange,
    pageCount,
    pagination,
    paginationLabels,
    pageSizeOptions,
    renderToolbar,
    renderRow,
    rowLayout,
    rowSelection,
    selectAllLabel = 'Select all rows',
    selectRowLabel = 'Select row',
    smallPagination = false,
    sorting,
    tableBodyClassName,
    tableWrapperClassName,
    totalCount,
    columnVisibility,
  } = props
  const { t } = useTranslation()
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({})
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const resolvedColumnVisibility = columnVisibility ?? internalColumnVisibility
  const resolvedRowSelection = rowSelection ?? internalRowSelection
  const resolvedSorting = sorting ?? internalSorting
  const resolvedLabels: DataTableLabels = {
    empty: t('common.noRecords'),
    loading: t('common.loading'),
    ...labels,
  }
  const selectColumn = useMemo(
    () =>
      hasCheckboxes
        ? createSelectColumn<TData>({ selectAllLabel, selectRowLabel })
        : undefined,
    [hasCheckboxes, selectAllLabel, selectRowLabel]
  )
  const resolvedColumns = useMemo<AnyValueColumnDef<TData>[]>(
    () => (selectColumn ? [selectColumn, ...columns] : [...columns]),
    [columns, selectColumn]
  )
  const table = useReactTable<TData>({
    columns: resolvedColumns,
    data: data as TData[],
    enableRowSelection: hasCheckboxes,
    enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering,
    manualPagination,
    manualSorting,
    onColumnFiltersChange,
    onColumnVisibilityChange:
      onColumnVisibilityChange ?? setInternalColumnVisibility,
    onPaginationChange,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onSortingChange: onSortingChange ?? setInternalSorting,
    pageCount,
    state: {
      columnFilters,
      columnVisibility: resolvedColumnVisibility,
      pagination,
      rowSelection: resolvedRowSelection,
      sorting: resolvedSorting,
    },
  })

  return (
    <SimpleDataTable
      caption={caption}
      className={className}
      emptyContent={emptyContent ?? emptyStateText}
      hasActiveFilters={hasActiveFilters}
      isLoading={isLoading}
      labels={resolvedLabels}
      noResultsContent={noResultsContent}
      renderPagination={(currentTable) => (
        <DataTablePagination
          hasCheckboxes={hasCheckboxes}
          labels={paginationLabels}
          pageSizeOptions={pageSizeOptions}
          smallPagination={smallPagination}
          table={currentTable}
          totalCount={totalCount}
        />
      )}
      renderToolbar={renderToolbar}
      renderRow={renderRow}
      rowLayout={rowLayout}
      table={table}
      tableBodyClassName={tableBodyClassName}
      tableWrapperClassName={tableWrapperClassName}
    />
  )
}
