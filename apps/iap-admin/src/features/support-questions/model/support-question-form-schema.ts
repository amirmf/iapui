import { supportRequiredParamInputDisplaySchema } from '@iap/api-types'
import { type TFunction } from 'i18next'
import { z } from 'zod'

export const supportQuestionFormSchema = (t?: TFunction) =>
  z.object({
    questionKey: z.string().min(1, t?.('supportQuestions.validation.key')),
    title: z.string().min(1, t?.('supportQuestions.validation.title')),
    staticResponse: z.string().optional(),
    level: z.string().optional(),
    requiredParam: z.string().optional(),
    requiredParamInputDisplay:
      supportRequiredParamInputDisplaySchema.optional(),
    sequence: z.string().optional(),
    nextSelectableQuestionKeys: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    roles: z.array(z.string()).optional(),
    pageTags: z.array(z.string()).optional(),
    featureTags: z.array(z.string()).optional(),
    active: z.boolean(),
  })

export type SupportQuestionForm = z.infer<
  ReturnType<typeof supportQuestionFormSchema>
>
