import type { Attachment } from '@iap/api-types'
import { Button } from '@iap/ui'
import { IconFileTypePdf } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface UploadedFilePreviewListProps {
  files: Attachment[]
  imagePreviewUrls: Record<string, string>
  onRemove: (index: number) => void
}

export function UploadedFilePreviewList(props: UploadedFilePreviewListProps) {
  const { files, imagePreviewUrls, onRemove } = props
  const { t } = useTranslation()

  if (!files.length) {
    return null
  }

  return (
    <ul className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {files.map((att, index) => (
        <li
          key={att.minioObjectName}
          className='flex flex-col rounded-md border p-3 text-sm'
        >
          <div className='flex min-h-30 items-center justify-center bg-muted/20 p-2'>
            {imagePreviewUrls[att.minioObjectName] ? (
              <img
                src={imagePreviewUrls[att.minioObjectName]}
                alt={att.filename}
                className='max-h-26 w-auto rounded object-contain'
              />
            ) : (
              <IconFileTypePdf className='size-10 text-red-500' />
            )}
          </div>
          <div className='flex flex-1 flex-col justify-between'>
            <span className='mt-2 line-clamp-2 block text-center'>
              {att.filename}
            </span>
            <Button
              presentation='reference'
              type='button'
              variant='destructive'
              onClick={() => onRemove(index)}
              className='mt-2 w-full'
            >
              {t('common.delete')}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
