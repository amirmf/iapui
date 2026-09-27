import { useCallback } from 'react'

function normalizeFileName(fileName: string) {
  const name = fileName.trim() || 'pivot-table'
  return name.endsWith('.csv') ? name : `${name}.csv`
}

export function downloadPivotCsv(
  fileName: string,
  rows: readonly (readonly string[])[]
) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
  const blob = new Blob(
    [rows.map((row) => row.map(escape).join(',')).join('\n')],
    { type: 'text/csv;charset=utf-8' }
  )
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.download = normalizeFileName(fileName)
  anchor.href = url
  anchor.click()
  URL.revokeObjectURL(url)
}

export function usePivotExportCsv(
  fileName: string,
  rows: readonly (readonly string[])[]
) {
  return useCallback(() => downloadPivotCsv(fileName, rows), [fileName, rows])
}
