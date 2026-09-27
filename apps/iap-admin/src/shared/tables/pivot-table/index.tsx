import { useMemo } from 'react'

import { SimpleDataTable } from '@shared/tables/data-table/simple-data-table'
import {
  type PivotRow,
  type PivotValueField,
  createPivotTableModel,
} from '@shared/tables/pivot-table/model'
import { PivotTableHeader } from '@shared/tables/pivot-table/pivot-table-header'
import { usePivotExportCsv } from '@shared/tables/pivot-table/use-pivot-export-csv'
import { usePivotExportPdf } from '@shared/tables/pivot-table/use-pivot-export-pdf'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

export type {
  PivotTableModel,
  PivotValueField,
} from '@shared/tables/pivot-table/model'

export function PivotTable<TData extends Record<string, unknown>>(props: {
  columnField: keyof TData & string
  csvLabel?: string
  data: readonly TData[]
  exportFileName?: string
  isLoading?: boolean
  labels?: { empty?: string; loading?: string; total?: string }
  pdfLabel?: string
  rowField: keyof TData & string
  rowHeaderLabel?: string
  valueFields: readonly PivotValueField<TData>[]
}) {
  const {
    columnField,
    csvLabel = 'Export CSV',
    data,
    exportFileName = 'pivot-table',
    isLoading,
    labels,
    pdfLabel = 'Export PDF',
    rowField,
    rowHeaderLabel = rowField,
    valueFields,
  } = props
  const model = useMemo(
    () => createPivotTableModel({ columnField, data, rowField, valueFields }),
    [columnField, data, rowField, valueFields]
  )
  const numberFormatter = useMemo(() => new Intl.NumberFormat(), [])
  const columnHelper = useMemo(() => createColumnHelper<PivotRow>(), [])
  const columns = useMemo(
    () => [
      columnHelper.accessor('label', {
        header: rowHeaderLabel,
        id: 'label',
        meta: { label: rowHeaderLabel },
      }),
      ...model.columnLabels.flatMap((columnLabel) =>
        valueFields.map((valueField) =>
          columnHelper.accessor(
            (row) => row.values[columnLabel]?.[valueField.field] ?? 0,
            {
              cell: (context) => numberFormatter.format(context.getValue()),
              header:
                valueFields.length === 1
                  ? columnLabel
                  : `${columnLabel} · ${valueField.label ?? valueField.field}`,
              id: `${columnLabel}-${valueField.field}`,
            }
          )
        )
      ),
      ...valueFields.map((valueField) =>
        columnHelper.accessor((row) => row.totals[valueField.field] ?? 0, {
          cell: (context) => numberFormatter.format(context.getValue()),
          header:
            valueFields.length === 1
              ? (labels?.total ?? 'Total')
              : `${labels?.total ?? 'Total'} · ${valueField.label ?? valueField.field}`,
          id: `total-${valueField.field}`,
        })
      ),
    ],
    [
      columnHelper,
      labels?.total,
      model.columnLabels,
      numberFormatter,
      rowHeaderLabel,
      valueFields,
    ]
  )
  const table = useReactTable({
    columns,
    data: model.rows,
    getCoreRowModel: getCoreRowModel(),
  })
  const exportRows = useMemo<readonly (readonly string[])[]>(
    () => [
      [
        rowHeaderLabel,
        ...model.columnLabels.flatMap((column) =>
          valueFields.map((field) =>
            valueFields.length === 1
              ? column
              : `${column} · ${field.label ?? field.field}`
          )
        ),
        ...valueFields.map((field) =>
          valueFields.length === 1
            ? (labels?.total ?? 'Total')
            : `${labels?.total ?? 'Total'} · ${field.label ?? field.field}`
        ),
      ],
      ...model.rows.map((row) => [
        row.label,
        ...model.columnLabels.flatMap((column) =>
          valueFields.map((field) =>
            numberFormatter.format(row.values[column]?.[field.field] ?? 0)
          )
        ),
        ...valueFields.map((field) =>
          numberFormatter.format(row.totals[field.field] ?? 0)
        ),
      ]),
    ],
    [
      labels?.total,
      model.columnLabels,
      model.rows,
      numberFormatter,
      rowHeaderLabel,
      valueFields,
    ]
  )
  const exportCsv = usePivotExportCsv(exportFileName, exportRows)
  const exportPdf = usePivotExportPdf(
    exportFileName,
    exportRows,
    model.rows.length
  )

  return (
    <SimpleDataTable
      isLoading={isLoading}
      labels={{ empty: labels?.empty, loading: labels?.loading }}
      renderToolbar={() => (
        <PivotTableHeader
          csvLabel={csvLabel}
          onExportCsv={exportCsv}
          onExportPdf={exportPdf}
          pdfLabel={pdfLabel}
        />
      )}
      table={table}
    />
  )
}
