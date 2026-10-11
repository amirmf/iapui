import { Button } from '@iap/ui'
import { X as XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type UploadStatus = {
  filename: string
  percent: number
  status: 'uploading' | 'failed'
}

interface UploadingFileListProps {
  uploadEntries: Array<[string, UploadStatus]>
  onClearFailed: (uploadId: string) => void
}

export function UploadingFileList(props: UploadingFileListProps) {
  const { uploadEntries, onClearFailed } = props
  const { t } = useTranslation()

  if (!uploadEntries.length) {
    return null
  }

  return (
    <ul className='mt-2 space-y-2'>
      {uploadEntries.map(([uploadId, status]) => (
        <li
          key={uploadId}
          className='flex items-center gap-2 rounded-md border p-2 text-sm'
        >
          <div className='flex-1 overflow-hidden'>
            <span className='line-clamp-1'>{status.filename}</span>
            {status.status === 'failed' ? (
              <span className='text-xs text-destructive'>
                {t('common.fileUploader.failed')}
              </span>
            ) : (
              <div className='mt-1 flex items-center gap-2'>
                <div className='h-1.5 flex-1 rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-primary transition-all'
                    style={{ width: `${status.percent}%` }}
                  />
                </div>
                <span className='text-xs text-muted-foreground'>
                  {t('common.fileUploader.progressValue', {
                    percent: status.percent,
                  })}
                </span>
              </div>
            )}
          </div>
          {status.status === 'failed' && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => onClearFailed(uploadId)}
              className='h-6 w-6 shrink-0'
            >
              <XIcon className='h-4 w-4' />
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
