import { z } from 'zod'

export const exportClaimRequestDocumentReceiptRequestSchema = z
  .object({ extMainNationalCode: z.string().trim().min(1) })
  .strict()

export const exportClaimRequestDocumentReceiptResponseSchema =
  z.instanceof(Blob)

export type ExportClaimRequestDocumentReceiptRequest = z.infer<
  typeof exportClaimRequestDocumentReceiptRequestSchema
>
export type ExportClaimRequestDocumentReceiptResponse = z.infer<
  typeof exportClaimRequestDocumentReceiptResponseSchema
>
