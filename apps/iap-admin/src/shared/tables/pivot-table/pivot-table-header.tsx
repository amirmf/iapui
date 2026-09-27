import { Button } from '@iap/ui'

export function PivotTableHeader(props: {
  csvLabel: string
  onExportCsv: () => void
  onExportPdf: () => void
  pdfLabel: string
}) {
  const { csvLabel, onExportCsv, onExportPdf, pdfLabel } = props

  return (
    <div className='flex flex-wrap gap-2'>
      <Button onClick={onExportCsv} size='sm' variant='outline'>
        {csvLabel}
      </Button>
      <Button onClick={onExportPdf} size='sm' variant='outline'>
        {pdfLabel}
      </Button>
    </div>
  )
}
