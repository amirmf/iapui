/* eslint-disable react-refresh/only-export-components */
import { useMemo } from 'react'

import { Button } from '@iap/ui'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { DataTable } from './data-table'
import { downloadPivotPdf } from './generate-pivot-pdf'

type PivotRow = {
  label: string
  totals: Record<string, number>
  values: Record<string, Record<string, number>>
}

export type PivotValueField<TData> = {
  field: keyof TData & string
  label?: string
}

export type PivotTableModel = {
  columnLabels: string[]
  grandTotals: Record<string, number>
  rows: PivotRow[]
}

function toLabel(value: unknown) {
  return value === null || value === undefined || value === ''
    ? '–'
    : String(value)
}

function toNumber(value: unknown) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

export function createPivotTableModel<
  TData extends Record<string, unknown>,
>(props: {
  columnField: keyof TData & string
  data: readonly TData[]
  rowField: keyof TData & string
  valueFields: readonly PivotValueField<TData>[]
}): PivotTableModel {
  const { columnField, data, rowField, valueFields } = props
  const rows = new Map<string, PivotRow>()
  const columnLabels = new Set<string>()
  const grandTotals: Record<string, number> = {}

  for (const item of data) {
    const rowLabel = toLabel(item[rowField])
    const columnLabel = toLabel(item[columnField])
    const row = rows.get(rowLabel) ?? {
      label: rowLabel,
      totals: {},
      values: {},
    }
    const values = row.values[columnLabel] ?? {}
    columnLabels.add(columnLabel)

    for (const valueField of valueFields) {
      const value = toNumber(item[valueField.field])
      values[valueField.field] = (values[valueField.field] ?? 0) + value
      row.totals[valueField.field] = (row.totals[valueField.field] ?? 0) + value
      grandTotals[valueField.field] =
        (grandTotals[valueField.field] ?? 0) + value
    }
    row.values[columnLabel] = values
    rows.set(rowLabel, row)
  }

  const collator = new Intl.Collator(undefined, { sensitivity: 'base' })

  return {
    columnLabels: [...columnLabels].sort(collator.compare),
    grandTotals,
    rows: [...rows.values()].sort((left, right) =>
      collator.compare(left.label, right.label)
    ),
  }
}

function downloadCsv(fileName: string, rows: string[][]) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
  const blob = new Blob(
    [rows.map((row) => row.map(escape).join(',')).join('\n')],
    { type: 'text/csv;charset=utf-8' }
  )
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
  anchor.href = url
  anchor.click()
  URL.revokeObjectURL(url)
}

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
  const columnHelper = createColumnHelper<PivotRow>()
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
  const csvRows = useMemo(
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

  return (
    <DataTable
      isLoading={isLoading}
      labels={{ empty: labels?.empty, loading: labels?.loading }}
      renderToolbar={() => (
        <div className='flex gap-2'>
          <Button
            onClick={() => downloadCsv(exportFileName, csvRows)}
            size='sm'
            variant='outline'
          >
            {csvLabel}
          </Button>
          <Button
            onClick={() =>
              downloadPivotPdf({
                fileName: exportFileName,
                header: csvRows[0] ?? [],
                rows: csvRows.slice(1),
                totalRowIndex: model.rows.length,
              })
            }
            size='sm'
            variant='outline'
          >
            {pdfLabel}
          </Button>
        </div>
      )}
      table={table}
    />
  )
}
