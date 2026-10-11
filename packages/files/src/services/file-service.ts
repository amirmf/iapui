import { getApiClient } from '@iap/api-client'
import {
  type Attachment,
  attachmentSchema,
  fileDownloadRequestSchema,
  fileDownloadResponseSchema,
  fileUploadRequestSchema,
} from '@iap/api-types'

export type FileTransferOptions = {
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export type FileUploadOptions = Pick<FileTransferOptions, 'onProgress'>
export type FileDownloadOptions = FileTransferOptions

export const fileService = {
  upload: async (
    file: File,
    options: FileUploadOptions = {}
  ): Promise<Attachment> => {
    fileUploadRequestSchema.parse({ file })
    const formData = new FormData()
    formData.append('file', file)
    const response = await getApiClient().post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: options.onProgress
        ? (event) => {
            if (!event.total) {
              options.onProgress?.(0)
              return
            }
            const percent = Math.min(
              100,
              Math.round((event.loaded / event.total) * 100)
            )
            options.onProgress?.(percent)
          }
        : undefined,
    })
    return attachmentSchema.parse(response.data)
  },

  download: async (
    attachmentId: string,
    options: FileDownloadOptions = {}
  ): Promise<Blob> => {
    fileDownloadRequestSchema.parse({ attachmentId })
    const response = await getApiClient().get(
      `/files/download/attachment/${encodeURIComponent(attachmentId)}`,
      {
        responseType: 'blob',
        signal: options.signal,
        onDownloadProgress: options.onProgress
          ? (event) => {
              if (!event.total) {
                options.onProgress?.(0)
                return
              }
              const percent = Math.min(
                100,
                Math.round((event.loaded / event.total) * 100)
              )
              options.onProgress?.(percent)
            }
          : undefined,
      }
    )

    return fileDownloadResponseSchema.parse(response.data)
  },
}

export default fileService
