import { type TFunction } from 'i18next'
import { z } from 'zod'

export const supportPageFormSchema = (t?: TFunction) =>
  z.object({
    pageKey: z.string().min(1, t?.('supportPages.validation.key')),
    title: z.string().min(1, t?.('supportPages.validation.title')),
    description: z.string().optional(),
    active: z.boolean(),
  })

export type SupportPageForm = z.infer<ReturnType<typeof supportPageFormSchema>>
