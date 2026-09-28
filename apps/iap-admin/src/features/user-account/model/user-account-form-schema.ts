import {
  branchLocationSchema,
  nationalityTypeSchema,
  partyRoleSchema,
} from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

const mobileNumberPattern = /^(\+989\d{9}|09\d{9})$/

export function createPartyUserAccountDialogSchema(t: TFunction) {
  return z
    .object({
      branchLocations: z.array(branchLocationSchema).optional(),
      confirmPassword: z
        .string()
        .min(6, t('parties.userAccount.validation.confirmPassword')),
      docTypeCodes: z
        .array(z.string())
        .min(1, t('parties.userAccount.validation.docTypeCodesRequired')),
      email: z
        .email(t('parties.userAccount.validation.email'))
        .or(z.literal('')),
      extId: z.string().optional(),
      fname: z.string().min(1, t('parties.validation.firstName')),
      hasAccessToAllBranch: z.boolean().nullable().optional(),
      lname: z.string().min(1, t('parties.validation.lastName')),
      mobileNumber: z
        .string()
        .regex(mobileNumberPattern, t('auth.validation.mobileNumberPattern')),
      nationalityType: nationalityTypeSchema.nullable().optional(),
      parentUserAccountId: z.uuid().or(z.literal('')),
      password: z.string().min(6, t('parties.userAccount.validation.password')),
      roles: z
        .array(partyRoleSchema)
        .min(1, t('parties.userAccount.validation.rolesRequired')),
      username: z.string().min(3, t('parties.userAccount.validation.username')),
    })
    .superRefine((data, context) => {
      if (
        data.roles.includes('ROLE_MAIN_ASSESSMENT_USER') &&
        !data.extId?.trim()
      ) {
        context.addIssue({
          code: 'custom',
          message: t('parties.userAccount.validation.extId'),
          path: ['extId'],
        })
      }
      if (data.password !== data.confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: t('parties.userAccount.validation.passwordsMatch'),
          path: ['confirmPassword'],
        })
      }
    })
}

export function updateUserAccountSchema(t: TFunction) {
  return z
    .object({
      accountNonExpired: z.boolean().default(true),
      accountNonLocked: z.boolean().default(true),
      branchLocations: z.array(branchLocationSchema).optional(),
      credentialsNonExpired: z.boolean().default(true),
      docTypeCodes: z.array(z.string()).optional(),
      email: z
        .email(t('parties.userAccount.validation.email'))
        .or(z.literal(''))
        .optional(),
      enabled: z.boolean().default(true),
      extContractId: z.string().nullable().optional(),
      extId: z.string().optional(),
      fname: z.string().trim().optional(),
      hasAccessToAllBranch: z.boolean().nullable().optional(),
      lname: z.string().trim().optional(),
      mobileNumber: z
        .string()
        .regex(mobileNumberPattern, t('auth.validation.mobileNumberPattern')),
      nationalityType: nationalityTypeSchema.nullable().optional(),
      parentUserAccountId: z.uuid().or(z.literal('')).optional(),
      password: z
        .string()
        .min(6, t('parties.userAccount.validation.password'))
        .or(z.literal(''))
        .optional(),
      roles: z.array(partyRoleSchema).optional(),
      username: z
        .string()
        .min(3, t('parties.userAccount.validation.username'))
        .max(150, t('auth.validation.usernameMaxLength' as never))
        .regex(/^\d{10}$/, t('auth.validation.usernamePattern' as never))
        .trim(),
    })
    .superRefine((data, context) => {
      if (
        data.roles?.includes('ROLE_MAIN_ASSESSMENT_USER') &&
        !data.extId?.trim()
      ) {
        context.addIssue({
          code: 'custom',
          message: t('parties.userAccount.validation.extId'),
          path: ['extId'],
        })
      }
    })
}

export function resetPasswordSchema(t: TFunction) {
  return z
    .object({
      confirmPassword: z
        .string()
        .min(6, t('parties.userAccount.validation.confirmPassword')),
      password: z.string().min(6, t('parties.userAccount.validation.password')),
    })
    .superRefine((data, context) => {
      if (data.password !== data.confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: t('parties.userAccount.validation.passwordsMatch'),
          path: ['confirmPassword'],
        })
      }
    })
}

export type PartyUserAccountDialogForm = z.infer<
  ReturnType<typeof createPartyUserAccountDialogSchema>
>
export type UpdateUserAccountFormValues = z.input<
  ReturnType<typeof updateUserAccountSchema>
>
export type ParsedUpdateUserAccountFormValues = z.output<
  ReturnType<typeof updateUserAccountSchema>
>
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>
