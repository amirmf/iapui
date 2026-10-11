import { cn } from '@iap/ui'

import type { IDocument } from '../hooks/use-lazy-documents'

interface FilePdfViewerProps {
  activeDoc: IDocument
  loadingMessage: string
  errorMessageFallback: string
  docClassName?: string
}

function FilePdfViewer(props: FilePdfViewerProps) {
  const { activeDoc, errorMessageFallback, docClassName } = props

  if (!activeDoc.uri) {
    return (
      <div className={cn('h-[65vh] rounded border p-4', docClassName)}>
        {errorMessageFallback}
      </div>
    )
  }

  return (
    <div
      className={cn('h-[65vh] overflow-hidden rounded border', docClassName)}
    >
      <iframe
        key={`${activeDoc.uri}-${activeDoc.fileName ?? 'pdf'}`}
        src={activeDoc.uri}
        title={activeDoc.fileName ?? 'PDF document'}
        className='h-full w-full border-0'
      />
    </div>
  )
}

export default FilePdfViewer
