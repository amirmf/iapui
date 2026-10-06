import { z } from 'zod'

export const invoiceStateSchema = z.enum([
  'SUBMITTED',
  'EXTRACTING',
  'EXTRACTED',
  'FAILED',
])

export type MedicalCenterInvoiceState = z.infer<typeof invoiceStateSchema>

export const invoiceAttachmentSchema = z.object({
  id: z.string().optional(),
  filename: z.string().optional(),
  contentType: z.string().optional(),
  size: z.number().int().optional(),
  uploadedAt: z.string().optional(),
  objectName: z.string().optional(),
  bucketName: z.string().optional(),
})

export const medicalCenterInvoiceRecordSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  nationalCode: z.string(),
  amount: z.number().min(0),
  ratio: z.number().min(0),
  insuranceAmount: z.number().min(0),
  serviceTitle: z.string(),
  title: z.string(),
  serviceDate: z.string(),
  doctor: z.string(),
  attachments: z.array(invoiceAttachmentSchema),
})

export const medicalCenterInvoiceSchema = z.object({
  id: z.string().nullish(),
  state: invoiceStateSchema.nullish(),
  extractionErrorDescription: z.string().nullish(),
  documentNumber: z.string().nullish(),
  date: z.string().nullish(),
  printDate: z.string().nullish(),
  issueDate: z.string().nullish(),
  totalAmount: z.number().nullish(),
  invoiceFile: invoiceAttachmentSchema.nullish(),
  records: z.array(medicalCenterInvoiceRecordSchema),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedBy: z.string().nullish(),
  thruDate: z.string().nullish(),
})

const sortSchema = z.object({
  sorted: z.boolean().optional(),
  empty: z.boolean().optional(),
  unsorted: z.boolean().optional(),
})

export const medicalCenterInvoicePageSchema = z.object({
  totalElements: z.number().int().optional(),
  totalPages: z.number().int().optional(),
  size: z.number().int().optional(),
  content: z.array(medicalCenterInvoiceSchema).optional(),
  number: z.number().int().optional(),
  sort: sortSchema.optional(),
  numberOfElements: z.number().int().optional(),
  first: z.boolean().optional(),
  last: z.boolean().optional(),
  empty: z.boolean().optional(),
})

export const medicalCenterInvoiceListRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().positive().default(30),
  sort: z.string().optional(),
  direction: z.enum(['ASC', 'DESC']).optional(),
  filters: z.record(z.string(), z.string()).default({}),
})

export const medicalCenterInvoiceUploadSchema = z.object({
  file: z.custom<File>(
    (value) => value instanceof File && value.size > 0,
    'A non-empty file is required'
  ),
})

export const createMedicalCenterInvoiceEditSchema = (
  t: (key: 'medicalCenter.validation.amountInvalid') => string
) =>
  z.object({
    documentNumber: z.string(),
    date: z.date().optional(),
    printDate: z.date().optional(),
    issueDate: z.date().optional(),
    totalAmount: z.coerce
      .number({ message: t('medicalCenter.validation.amountInvalid') })
      .min(0, t('medicalCenter.validation.amountInvalid')),
    state: invoiceStateSchema,
  })

export type MedicalCenterInvoice = z.infer<typeof medicalCenterInvoiceSchema>
export type MedicalCenterInvoiceListRequest = z.infer<
  typeof medicalCenterInvoiceListRequestSchema
>
export type MedicalCenterInvoiceUpload = z.infer<
  typeof medicalCenterInvoiceUploadSchema
>
export type MedicalCenterInvoiceEdit = z.infer<
  ReturnType<typeof createMedicalCenterInvoiceEditSchema>
>
