import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { Attachment } from '@iap/api-types'
import { cn } from '@iap/ui'
import { UploadedFilePreviewList } from '@modules/files/components/uploaded-file-preview-list'
import {
  type UploadStatus,
  UploadingFileList,
} from '@modules/files/components/uploading-file-list'
import fileService, {
  type FileUploadOptions,
} from '@modules/files/services/file-service'
import { convertHeicToJpeg as convertHeicToJpegBlob } from '@modules/files/utils/convert-heic-to-jpeg'
import { detectFileTypeByHex, isHeic } from '@modules/files/utils/file-types'
import { Upload as UploadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface FileUploaderProps {
  value?: Attachment[]
  onChange: (attachments: Attachment[]) => void
  onUploadingChange?: (isUploading: boolean) => void
  maxFiles?: number
  onUpload?: (file: File, options: FileUploadOptions) => Promise<void>
}

const ALLOWED_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'heic',
  'heif',
  'pdf',
])
// const ALLOWED_MIME_TYPES = new Set([
//   'image/png',
//   'image/jpg',
//   'image/jpeg',
//   'image/heic',
//   'image/heif',
//   'application/pdf',
// ])
async function isAllowedFile(file: File) {
  const detectedType = await detectFileTypeByHex(file)
  if (detectedType) {
    return ALLOWED_EXTENSIONS.has(detectedType)
  }
  return false
}

function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase()
}

async function convertHeicToJpeg(file: File) {
  const extension = getFileExtension(file.name)
  const baseName = extension
    ? file.name.slice(0, -(extension.length + 1))
    : file.name

  const jpegBlob = await convertHeicToJpegBlob(file)

  if (!(jpegBlob instanceof Blob)) {
    throw new Error('Failed to convert HEIC image to JPEG')
  }

  return new File([jpegBlob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: file.lastModified,
  })
}

export function FileUploader(props: FileUploaderProps) {
  const { value = [], onChange, onUploadingChange, maxFiles, onUpload } = props
  const { t } = useTranslation()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, UploadStatus>
  >({})
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadIdRef = useRef(0)
  const imagePreviewUrlsRef = useRef<Record<string, string>>({})
  const [imagePreviewUrls, setImagePreviewUrls] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    const attachmentKeys = new Set(
      value.map((attachment) => attachment.minioObjectName)
    )
    const nextPreviewUrls = Object.entries(imagePreviewUrlsRef.current).reduce<
      Record<string, string>
    >((acc, [attachmentKey, url]) => {
      if (attachmentKeys.has(attachmentKey)) {
        acc[attachmentKey] = url
      } else {
        URL.revokeObjectURL(url)
      }
      return acc
    }, {})

    if (
      Object.keys(nextPreviewUrls).length !==
      Object.keys(imagePreviewUrlsRef.current).length
    ) {
      imagePreviewUrlsRef.current = nextPreviewUrls
      setImagePreviewUrls(nextPreviewUrls)
    }
  }, [value])

  useEffect(
    () => () => {
      Object.values(imagePreviewUrlsRef.current).forEach((url) =>
        URL.revokeObjectURL(url)
      )
      imagePreviewUrlsRef.current = {}
    },
    []
  )

  const addImagePreview = (attachment: Attachment, file: File) => {
    if (!attachment.fileType.toLowerCase().startsWith('image/')) return

    const attachmentKey = attachment.minioObjectName
    const previousUrl = imagePreviewUrlsRef.current[attachmentKey]
    if (previousUrl) URL.revokeObjectURL(previousUrl)

    const nextPreviewUrls = {
      ...imagePreviewUrlsRef.current,
      [attachmentKey]: URL.createObjectURL(file),
    }
    imagePreviewUrlsRef.current = nextPreviewUrls
    setImagePreviewUrls(nextPreviewUrls)
  }

  const createUploadId = () => `upload-${uploadIdRef.current++}`
  const startTrackingUpload = (id: string, filename: string) => {
    setUploadStatuses((prev) => ({
      ...prev,
      [id]: { filename, percent: 0, status: 'uploading' },
    }))
  }
  const updateUploadProgress = (id: string, percent: number) => {
    setUploadStatuses((prev) => {
      const current = prev[id]
      if (!current || current.status === 'failed') return prev
      return {
        ...prev,
        [id]: { ...current, percent },
      }
    })
  }
  const markUploadFailed = (id: string) => {
    setUploadStatuses((prev) => {
      const current = prev[id]
      if (!current) return prev
      return {
        ...prev,
        [id]: { ...current, status: 'failed' },
      }
    })
  }

  const clearUploadStatus = (id: string) => {
    setUploadStatuses((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files)
    const availableSlots =
      maxFiles === undefined ? Infinity : Math.max(maxFiles - value.length, 0)
    const fileArray = selectedFiles.slice(0, availableSlots)
    const validationResults = await Promise.all(
      fileArray.map(async (file) => ({
        file,
        isAllowed: await isAllowedFile(file),
      }))
    )
    const allowed = validationResults
      .filter((result) => result.isAllowed)
      .map((result) => result.file)
    if (!allowed.length) {
      toast.error(t('common.fileUploader.onlyAllowed'))
      return
    }
    const skipped = selectedFiles.length - allowed.length
    if (skipped) {
      toast.error(t('common.fileUploader.someSkipped'))
    }
    setIsUploading(true)
    onUploadingChange?.(true)
    const uploaded: Attachment[] = []

    try {
      for (const file of allowed) {
        let uploadableFile = file
        const isFileHeic = await isHeic(file)
        if (isFileHeic) {
          try {
            uploadableFile = await convertHeicToJpeg(file)
          } catch {
            toast.error(
              t('common.fileUploader.heicConversionFailed', {
                filename: file.name,
              })
            )
            continue
          }
        }
        const uploadId = createUploadId()
        startTrackingUpload(uploadId, uploadableFile.name)
        try {
          const options: FileUploadOptions = {
            onProgress: (percent) => updateUploadProgress(uploadId, percent),
          }
          if (onUpload) {
            await onUpload(uploadableFile, options)
          } else {
            const attachment = await fileService.upload(uploadableFile, options)
            uploaded.push(attachment)
            addImagePreview(attachment, uploadableFile)
          }
          clearUploadStatus(uploadId)
        } catch {
          markUploadFailed(uploadId)
          toast.error(
            t('common.fileUploader.uploadFailed', {
              filename: uploadableFile.name,
            })
          )
        }
      }

      if (uploaded.length) {
        onChange([...value, ...uploaded])
      }
    } finally {
      setIsUploading(false)
      onUploadingChange?.(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files)
    }
  }

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    await handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const uploadEntries = Object.entries(uploadStatuses)

  return (
    <div>
      <div
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-center text-sm transition-colors',
          'hover:bg-muted/50',
          isUploading && 'cursor-not-allowed opacity-60'
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <UploadIcon className='mb-2 h-8 w-8 text-muted-foreground' />
        <span className='block text-muted-foreground'>
          {t('common.fileUploader.dragAndDrop')}
        </span>
        <span className='block text-xs text-muted-foreground'>
          {t('common.fileUploader.allowedTypes')}
        </span>
      </div>
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        multiple={maxFiles === undefined || maxFiles > 1}
        accept='.png,.jpg,.jpeg,.heic,.heif,application/pdf'
        onChange={onInputChange}
        disabled={isUploading}
      />
      <UploadingFileList
        uploadEntries={uploadEntries}
        onClearFailed={clearUploadStatus}
      />
      <UploadedFilePreviewList
        files={value}
        imagePreviewUrls={imagePreviewUrls}
        onRemove={removeFile}
      />
    </div>
  )
}
