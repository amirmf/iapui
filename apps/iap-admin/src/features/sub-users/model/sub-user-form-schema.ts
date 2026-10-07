import { subUserExtLocationSchema, subUserRoleSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

export const mobilePhoneRegex = /^(\+989\d{9}|09\d{9})$/

export const subUserPayloadSchemaBase = (t: TFunction) =>
  z.object({
    branchLocations: z.array(subUserExtLocationSchema).nullable().optional(),
    docTypeCodes: z
      .array(z.string())
      .min(1, { message: t('subUsers.validation.docTypeCodes.required') }),
    email: z
      .string()
      .email({ message: t('subUsers.validation.email.invalid') })
      .or(z.literal(''))
      .nullable()
      .optional(),
    hasAccessToAllBranch: z.boolean().nullable().optional(),
    mobileNumber: z
      .string()
      .min(1, { message: t('subUsers.validation.mobileNumber.required') })
      .regex(mobilePhoneRegex, t('subUsers.validation.mobileNumber.invalid')),
    partyFname: z
      .string()
      .min(1, { message: t('subUsers.validation.partyFname.required') })
      .min(2, { message: t('subUsers.validation.partyFname.minLength') }),
    partyLname: z
      .string()
      .min(1, { message: t('subUsers.validation.partyLname.required') })
      .min(2, { message: t('subUsers.validation.partyLname.minLength') }),
    roles: z
      .array(subUserRoleSchema)
      .min(1, { message: t('subUsers.validation.roles.required') })
      .refine(
        (roles) =>
          !roles.includes('ROLE_DOCTOR_USER') ||
          (roles.length === 1 && roles[0] === 'ROLE_DOCTOR_USER'),
        {
          message: t('subUsers.validation.roles.doctorUserExclusive'),
        }
      ),
    username: z
      .string()
      .min(1, { message: t('subUsers.validation.username.required') })
      .length(10, { message: t('subUsers.validation.username.minLength') })
      .regex(/^\d{10}$/, {
        message: t('subUsers.validation.username.invalid'),
      }),
  })

export const createSubUserPayloadSchema = (t: TFunction) =>
  subUserPayloadSchemaBase(t).extend({
    password: z
      .string()
      .min(1, { message: t('subUsers.validation.password.required') })
      .min(6, { message: t('subUsers.validation.password.minLength') }),
  })

export type CreateSubUserPayload = z.infer<
  ReturnType<typeof createSubUserPayloadSchema>
>
export type CreateSubUserPayloadType = CreateSubUserPayload

export const updateSubUserPayloadSchema = (t: TFunction) =>
  subUserPayloadSchemaBase(t).extend({
    password: z
      .string()
      .min(1, { message: t('subUsers.validation.password.required') })
      .min(6, { message: t('subUsers.validation.password.minLength') })
      .or(z.literal(''))
      .optional(),
  })

export type UpdateSubUserPayload = z.infer<
  ReturnType<typeof updateSubUserPayloadSchema>
>
export type UpdateSubUserPayloadType = UpdateSubUserPayload

export type SubUserFormValues = CreateSubUserPayload | UpdateSubUserPayload
