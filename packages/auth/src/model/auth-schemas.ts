import type {
  LoginRequest,
  PasswordResetIdentity,
  RegistrationIdentity,
} from '@iap/api-types'
import { iranianNationalCodeRegex, mobilePhoneRegex } from '@iap/shared-lib'
import { z } from 'zod'

type Translate = (key: string) => string

const otpCode = /^\d{4,9}$/

export function createLoginSchema(t: Translate) {
  return z.object({
    password: z.string().min(1, t('auth.validation.passwordRequired')),
    username: z.string().min(1, t('auth.validation.usernameRequired')),
  })
}

export function createRegistrationIdentitySchema(t: Translate) {
  return z.discriminatedUnion('nationalityType', [
    z.object({
      nationalCode: z
        .string()
        .trim()
        .regex(iranianNationalCodeRegex, t('auth.validation.nationalCode')),
      nationalityType: z.literal('IR'),
      phoneNumber: z
        .string()
        .trim()
        .regex(mobilePhoneRegex, t('auth.validation.mobileNumber')),
    }),
    z.object({
      nationalCode: z.string().trim(),
      nationalityType: z.literal('FOREIGN'),
      phoneNumber: z
        .string()
        .trim()
        .regex(mobilePhoneRegex, t('auth.validation.mobileNumber')),
    }),
  ])
}

export function createPasswordSchema(t: Translate) {
  return z
    .object({
      otpCode: z.string().trim().regex(otpCode, t('auth.validation.otpCode')),
      password: z.string().min(6, t('auth.validation.passwordMinLength')),
      verifyPassword: z
        .string()
        .min(1, t('auth.validation.passwordConfirmationRequired')),
    })
    .refine((values) => values.password === values.verifyPassword, {
      message: t('auth.validation.passwordsMatch'),
      path: ['verifyPassword'],
    })
}

export function createPasswordResetIdentitySchema(t: Translate) {
  return z.object({
    mobileNumber: z
      .string()
      .trim()
      .regex(mobilePhoneRegex, t('auth.validation.mobileNumber')),
    nationalCode: z
      .string()
      .trim()
      .regex(iranianNationalCodeRegex, t('auth.validation.nationalCode')),
  })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegistrationIdentityFormValues = z.infer<
  ReturnType<typeof createRegistrationIdentitySchema>
>
export type PasswordFormValues = z.infer<
  ReturnType<typeof createPasswordSchema>
>
export type PasswordResetIdentityFormValues = z.infer<
  ReturnType<typeof createPasswordResetIdentitySchema>
>

export function toLoginRequest(values: LoginFormValues): LoginRequest {
  return values
}

export function toRegistrationIdentity(
  values: RegistrationIdentityFormValues
): RegistrationIdentity {
  return {
    nationalCode: values.nationalCode.trim(),
    nationalityType: values.nationalityType,
    phoneNumber: values.phoneNumber.trim(),
  }
}

export function toPasswordResetIdentity(
  values: PasswordResetIdentityFormValues
): PasswordResetIdentity {
  return {
    mobileNumber: values.mobileNumber.trim(),
    nationalCode: values.nationalCode.trim(),
  }
}
