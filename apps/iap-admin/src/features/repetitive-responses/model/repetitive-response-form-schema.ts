import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createRepetitiveResponseFormSchema = (t: TFunction) =>
  z.object({
    description: z
      .string()
      .min(1, t('repetitiveResponses.validation.responseRequired')),
    repetitiveResponseGroupId: z
      .string()
      .min(1, t('repetitiveResponses.validation.groupRequired')),
    seqNum: z.coerce.number().int().min(0),
    title: z.string().min(1, t('repetitiveResponses.validation.titleRequired')),
    usageCount: z.coerce.number().int().min(0),
  })

export const createRepetitiveResponseGroupFormSchema = (t: TFunction) =>
  z.object({
    seqNum: z.coerce.number().int().min(0),
    title: z
      .string()
      .min(1, t('repetitiveResponseGroups.validation.titleRequired')),
  })

export type RepetitiveResponseForm = z.infer<
  ReturnType<typeof createRepetitiveResponseFormSchema>
>
export type RepetitiveResponseGroupForm = z.infer<
  ReturnType<typeof createRepetitiveResponseGroupFormSchema>
>
