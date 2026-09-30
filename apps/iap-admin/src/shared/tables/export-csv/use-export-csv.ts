import { useCallback, useMemo } from 'react'

import { useExportCsvStore } from '@shared/tables/export-csv/use-export-csv-store'
import { saveAs } from 'file-saver'

function toCsvFileName(fileName: string) {
  const trimmedFileName = fileName.trim()
  if (!trimmedFileName) return 'export.csv'

  return trimmedFileName.toLowerCase().endsWith('.csv')
    ? trimmedFileName
    : `${trimmedFileName}.csv`
}

type UseExportCsvParams = { exportFileName: string; exportKey: string }

export function useExportCsv(props: UseExportCsvParams) {
  const { exportFileName, exportKey } = props
  const resolvedExportFileName = useMemo(
    () => toCsvFileName(exportFileName),
    [exportFileName]
  )
  const startExport = useExportCsvStore((state) => state.startExport)
  const finishExport = useExportCsvStore((state) => state.finishExport)
  const isExporting = useExportCsvStore(
    (state) => state.isExportingByKey[exportKey] ?? false
  )

  const exportCsv = useCallback(
    async (csvRows: string[][]) => {
      const canStartExport = startExport(exportKey)
      if (!canStartExport) return

      try {
        const { utils } = await import('xlsx')
        const worksheet = utils.aoa_to_sheet(csvRows)
        const csvContent = utils.sheet_to_csv(worksheet)
        const csvWithBom = `\uFEFF${csvContent}`
        const blob = new Blob([csvWithBom], {
          type: 'text/csv;charset=utf-8;',
        })
        saveAs(blob, resolvedExportFileName)
      } finally {
        finishExport(exportKey)
      }
    },
    [exportKey, finishExport, resolvedExportFileName, startExport]
  )

  return { exportCsv, isExporting }
}
