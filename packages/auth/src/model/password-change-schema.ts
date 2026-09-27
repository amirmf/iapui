import { z } from 'zod'

type Translate = (key: string) => string

export type PasswordRequirement =
  'minimumLength' | 'uppercaseLetter' | 'lowercaseLetter' | 'symbol' | 'number'

export const passwordRequirementTranslationKeys: Record<
  PasswordRequirement,
  string
> = {
  minimumLength: 'auth.passwordChange.requirements.minimumLength',
  uppercaseLetter: 'auth.passwordChange.requirements.uppercaseLetter',
  lowercaseLetter: 'auth.passwordChange.requirements.lowercaseLetter',
  symbol: 'auth.passwordChange.requirements.symbol',
  number: 'auth.passwordChange.requirements.number',
}

export function getPasswordRequirements(password: string) {
  return {
    minimumLength: password.length >= 12,
    uppercaseLetter: /[A-Z]/.test(password),
    lowercaseLetter: /[a-z]/.test(password),
    symbol: /[^A-Za-z0-9\s]/.test(password),
    number: /\d/.test(password),
  }
}

export function createPasswordChangeSchema(t: Translate) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t('auth.passwordChange.validation.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(1, t('auth.passwordChange.validation.newPasswordRequired'))
        .max(255, t('auth.passwordChange.validation.newPasswordMaxLength')),
      confirmNewPassword: z
        .string()
        .min(1, t('auth.passwordChange.validation.confirmNewPasswordRequired')),
    })
    .superRefine((values, context) => {
      if (
        !Object.values(getPasswordRequirements(values.newPassword)).every(
          Boolean
        )
      ) {
        context.addIssue({
          code: 'custom',
          message: t('auth.passwordChange.validation.passwordRequirements'),
          path: ['newPassword'],
        })
      }

      if (values.newPassword !== values.confirmNewPassword) {
        context.addIssue({
          code: 'custom',
          message: t('auth.passwordChange.validation.passwordsMatch'),
          path: ['confirmNewPassword'],
        })
      }
    })
}

export type PasswordChangeFormValues = z.infer<
  ReturnType<typeof createPasswordChangeSchema>
>
