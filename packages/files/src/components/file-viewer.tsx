import type { CSSProperties } from 'react'

import type { Attachment } from '@iap/api-types'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { useLazyDocuments } from '../hooks/use-lazy-documents'
import { AttachmentPager } from './attachment-pager'
import { AttachmentViewerContent } from './attachment-viewer-content'
import { useImageViewerState } from './use-image-viewer-state'

interface FileViewerProps {
  attachments: Attachment[]
  className?: string
  imageViewerClassName?: string
  imageViewportClassName?: string
  transformComponentWrapperStyle?: CSSProperties
  transformComponentWrapperClassName?: string
  docClassName?: string
}

export function FileViewer(props: FileViewerProps) {
  const {
    attachments,
    className,
    imageViewerClassName,
    imageViewportClassName,
    transformComponentWrapperClassName,
    transformComponentWrapperStyle,
    docClassName,
  } = props
  const { t } = useTranslation()

  const {
    docs,
    selectedDocIndex,
    setSelectedDocIndex,
    ensureDocument,
    activeDocEntry,
  } = useLazyDocuments({
    attachments,
  })

  const {
    activeImageViewKey,
    activeImageViewState,
    rotateCurrentImage,
    selectImage,
    updateCurrentImageViewState,
    updateLatestImageTransform,
  } = useImageViewerState({
    activeFile: activeDocEntry?.attachment,
    activeIndex: selectedDocIndex,
    onSelectImage: setSelectedDocIndex,
  })

  if (docs.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center gap-2'>
        <p className='text-sm font-semibold'>
          {t('claimRequests.dialog.fields.attachments')}
        </p>
        <AttachmentPager
          docs={docs}
          selectedIndex={selectedDocIndex}
          onSelect={selectImage}
        />
      </div>

      <AttachmentViewerContent
        docEntry={activeDocEntry}
        onRetry={() => ensureDocument(selectedDocIndex, { force: true })}
        docClassName={docClassName}
        imageViewerClassName={imageViewerClassName}
        imageViewportClassName={imageViewportClassName}
        imageViewKey={activeImageViewKey}
        imageViewState={activeImageViewState}
        onImageViewStateChange={updateCurrentImageViewState}
        onLatestImageTransformChange={updateLatestImageTransform}
        onRotateImage={rotateCurrentImage}
        transformComponentWrapperClassName={transformComponentWrapperClassName}
        transformComponentWrapperStyle={transformComponentWrapperStyle}
      />
    </div>
  )
}

export default FileViewer
