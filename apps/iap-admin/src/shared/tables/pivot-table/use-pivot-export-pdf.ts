import { useCallback } from 'react'

import { downloadPivotPdf } from '@shared/tables/pivot-table/generate-pivot-pdf'

export function usePivotExportPdf(
  fileName: string,
  rows: readonly (readonly string[])[],
  totalRowIndex?: number
) {
  return useCallback(
    () =>
      void downloadPivotPdf({
        fileName,
        header: [...(rows[0] ?? [])],
        rows: rows.slice(1).map((row) => [...row]),
        totalRowIndex,
      }),
    [fileName, rows, totalRowIndex]
  )
}
