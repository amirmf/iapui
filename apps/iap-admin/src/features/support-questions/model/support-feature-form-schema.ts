import { type TFunction } from 'i18next'
import { z } from 'zod'

export const supportFeatureFormSchema = (t?: TFunction) =>
  z.object({
    featureKey: z.string().min(1, t?.('supportFeatures.validation.key')),
    title: z.string().min(1, t?.('supportFeatures.validation.title')),
    description: z.string().optional(),
    pageKeys: z.array(z.string()).optional(),
    active: z.boolean(),
  })

export type SupportFeatureForm = z.infer<
  ReturnType<typeof supportFeatureFormSchema>
>
