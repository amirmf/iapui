import { z } from 'zod'

export const attachmentSchema = z
  .object({
    id: z.string().nullish(),
    filename: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    uploadDate: z.string(),
    minioObjectName: z.string(),
    bucketName: z.string(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .loose()

export type Attachment = z.infer<typeof attachmentSchema>

export const fileUploadRequestSchema = z
  .object({ file: z.instanceof(File) })
  .strict()
export const fileDownloadRequestSchema = z
  .object({ attachmentId: z.string() })
  .strict()
export const fileDownloadResponseSchema = z.instanceof(Blob)
