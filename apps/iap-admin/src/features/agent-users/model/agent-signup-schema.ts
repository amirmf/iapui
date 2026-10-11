import { nationalityTypeSchema } from '@iap/api-types'
import { mobilePhoneRegex } from '@iap/shared-lib'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createAgentSignupFormSchema = (t: TFunction) =>
  z
    .object({
      phoneNumber: z
        .string()
        .trim()
        .regex(mobilePhoneRegex, t('agent.users.validation.phoneNumber')),
      nationalCode: z
        .string()
        .trim()
        .min(1, t('agent.users.validation.nationalCodeRequired')),
      password: z
        .string()
        .min(6, t('agent.users.validation.passwordMinLength'))
        .max(255, t('agent.users.validation.passwordMaxLength'))
        .refine(
          (value) => value.trim().length > 0,
          t('agent.users.validation.passwordRequired')
        ),
      confirmPassword: z
        .string()
        .min(1, t('agent.users.validation.confirmPasswordRequired')),
      nationalityType: nationalityTypeSchema.default('IR'),
    })
    .superRefine((values, context) => {
      if (values.password !== values.confirmPassword) {
        context.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: t('agent.users.validation.passwordsMatch'),
        })
      }
    })

export type AgentSignupFormValues = z.infer<
  ReturnType<typeof createAgentSignupFormSchema>
>
