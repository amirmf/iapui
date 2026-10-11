import type { CSSProperties } from 'react'

import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import type { LazyDocument } from '../hooks/use-lazy-documents'
import { FILE_MIME_TYPES, IMAGE_MIME_TYPES } from '../utils/file-types'
import FilePdfViewer from './file-pdf-viewer'
import ImageZoomPanViewer from './image-zoom-pan-viewer'
import type {
  ImageTransformState,
  ImageViewState,
} from './use-image-viewer-state'

interface AttachmentViewerContentProps {
  docEntry?: LazyDocument
  onRetry: () => void
  imageViewKey: string
  imageViewState: ImageViewState
  onImageViewStateChange: (state: ImageViewState) => void
  onLatestImageTransformChange: (transform: ImageTransformState) => void
  onRotateImage: (angleDelta: number) => void
  docClassName?: string
  imageViewerClassName?: string
  imageViewportClassName?: string
  transformComponentWrapperClassName?: string
  transformComponentWrapperStyle?: CSSProperties
}

export function AttachmentViewerContent(props: AttachmentViewerContentProps) {
  const {
    docEntry,
    onRetry,
    imageViewKey,
    imageViewState,
    onImageViewStateChange,
    onLatestImageTransformChange,
    onRotateImage,
    docClassName,
    imageViewerClassName,
    imageViewportClassName,
    transformComponentWrapperClassName,
    transformComponentWrapperStyle,
  } = props
  const { t } = useTranslation()

  const retryLabel = t('common.retry')
  const loadingMessage = t('files.viewer.loading')
  const errorMessageFallback = t('files.viewer.loadFailed')

  if (!docEntry) {
    return null
  }

  const activeDoc = docEntry.document
  const activeDocIsImage =
    !!activeDoc?.fileType && IMAGE_MIME_TYPES.has(activeDoc.fileType)
  const activeDocIsPdf =
    !!activeDoc?.fileType && FILE_MIME_TYPES.has(activeDoc.fileType)

  if (docEntry.status === 'loading') {
    const progress = docEntry.downloadProgress ?? 0

    return (
      <div
        className={cn(
          'text-muted-foreground flex h-[65vh] items-center justify-center rounded border text-sm',
          docClassName
        )}
      >
        <div className='w-full max-w-xs space-y-3 px-4 text-center'>
          <p>{loadingMessage}</p>
          <div className='flex items-center gap-2'>
            <div className='bg-muted h-2 flex-1 overflow-hidden rounded-full'>
              <div
                className='bg-primary h-full rounded-full transition-all'
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className='text-muted-foreground min-w-10 text-xs'>
              {t('files.viewer.progressValue', {
                percent: progress,
              })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (docEntry.status === 'error') {
    return (
      <div
        className={cn(
          'flex h-[65vh] flex-col items-center justify-center gap-3 rounded border text-center',
          docClassName
        )}
      >
        <p className='text-destructive text-sm'>
          {docEntry.error ?? errorMessageFallback}
        </p>
        <Button
          presentation='reference'
          variant='outline'
          size='sm'
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      </div>
    )
  }

  if (docEntry.status !== 'loaded' || !activeDoc) {
    return null
  }

  if (activeDocIsImage) {
    return (
      <ImageZoomPanViewer
        key={`${imageViewKey}-${activeDoc.uri}-${activeDoc.fileName ?? 'image'}`}
        src={activeDoc.uri ?? ''}
        alt={activeDoc.fileName ?? 'attachment'}
        viewKey={imageViewKey}
        viewState={imageViewState}
        onLatestTransformChange={onLatestImageTransformChange}
        onRotate={onRotateImage}
        onViewStateChange={onImageViewStateChange}
        outerClassName={imageViewerClassName}
        viewportClassName={imageViewportClassName}
        transformComponentWrapperClassName={transformComponentWrapperClassName}
        transformComponentWrapperStyle={transformComponentWrapperStyle}
      />
    )
  }

  if (activeDocIsPdf) {
    return (
      <FilePdfViewer
        activeDoc={activeDoc}
        docClassName={docClassName}
        errorMessageFallback={errorMessageFallback}
        loadingMessage={loadingMessage}
      />
    )
  }

  return null
}
