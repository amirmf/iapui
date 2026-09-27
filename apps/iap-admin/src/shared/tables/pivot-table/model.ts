export type PivotRow = {
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
