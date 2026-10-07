import { z } from 'zod'

/** Editable document contract; distinct from the full claim response document. */
export const documentSchema = z.object({
  id: z.string().nullish(),
  documentType: z.string().nullish(),
  docTypeCode: z.string().nullish(),
  docType: z.string().nullish(),
  extractedData: z.any().nullish(),
  extractionDate: z.string().nullish(),
  extractionModel: z.string().nullish(),
  dataJsonSchema: z.any().nullish(),
})

export type Document = z.infer<typeof documentSchema>
