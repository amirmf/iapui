import { iranianNationalCodeRegex, mobilePhoneRegex } from '@iap/shared-lib'
import { z } from 'zod'

const mobilePhoneSchema = z.string().regex(mobilePhoneRegex)
const iranianNationalCodeSchema = z.string().regex(iranianNationalCodeRegex)
const otpCodeSchema = z.string().regex(/^\d{4,9}$/)
const passwordSchema = z.string().min(6).max(255)

export const nationalityTypeSchema = z.enum(['IR', 'FOREIGN'])

export const partyRoleSchema = z.enum([
  'ROLE_PUBLIC_USER',
  'ROLE_MONITORING_USER',
  'ROLE_ASSESSMENT_USER',
  'ROLE_MAIN_ASSESSMENT_USER',
  'ROLE_HQ_USER',
  'ROLE_ADMIN_USER',
  'ROLE_SUPER_ADMIN',
  'ROLE_SUPER_ADMIN_USER',
  'ROLE_DOCTOR_USER',
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_MAIN_REQUEST_REGISTERY_AGENT',
  'ROLE_BRANCH_USER',
  'ROLE_CUSTOMER_USER',
  'ROLE_TICKET_AGENT',
])

export const personSpecialDiseaseEnumSchema = z.enum([
  'VIP',
  'LEVEL_ONE',
  'LEVEL_TWO',
  'SPECIAL_DISEASES',
  'SACRIFICE',
])

export const claimRequestYesNoSchema = z.enum(['Y', 'N'])

export const branchLocationSchema = z
  .object({
    address: z.string().nullable().optional(),
    beginDate: z.string().nullable().optional(),
    birthDay: z.number().int().nullable().optional(),
    birthMonth: z.number().int().nullable().optional(),
    birthYear: z.number().int().nullable().optional(),
    ciiCode: z.number().nullable().optional(),
    ciiValidationStatus: z.number().int().nullable().optional(),
    cityId: z.number().int().nullable().optional(),
    code: z.number().nullable().optional(),
    companyCode: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    degree: z.number().int().nullable().optional(),
    economicCode: z.string().nullable().optional(),
    educationField: z.string().nullable().optional(),
    educationLevelId: z.number().int().nullable().optional(),
    email: z.string().nullable().optional(),
    fatherName: z.string().nullable().optional(),
    fax: z.string().nullable().optional(),
    genderId: z.number().int().nullable().optional(),
    homeAddress: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
    identityNo: z.string().nullable().optional(),
    identityNoIssuPlace: z.string().nullable().optional(),
    isActive: z.number().int().nullable().optional(),
    lastName: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    mobile: z.string().nullable().optional(),
    municipalAreaId: z.number().int().nullable().optional(),
    name: z.string().nullable().optional(),
    nationalCode: z.string().nullable().optional(),
    personKindId: z.number().int().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    provinceId: z.number().int().nullable().optional(),
    tel: z.string().nullable().optional(),
    unitKindId: z.number().int().nullable().optional(),
    unitName: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    webSiteAddress: z.string().nullable().optional(),
  })
  .loose()

export const authUserSchema = z
  .object({
    accountNonExpired: z.boolean().nullable().optional(),
    accountNonLocked: z.boolean().nullable().optional(),
    avatarUrl: z.url().nullable().optional(),
    branchLocations: z.array(branchLocationSchema).optional(),
    createdAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    credentialsNonExpired: z.boolean().nullable().optional(),
    displayName: z.string().nullable().optional(),
    docTypeCodes: z.array(z.string()).optional(),
    email: z.string().nullable().optional(),
    enabled: z.boolean().nullable().optional(),
    extContractId: z.number().nullable().optional(),
    extId: z.string().nullable().optional(),
    fname: z.string().nullable().optional(),
    hasAccessToAllBranch: z.boolean().optional(),
    id: z.uuid(),
    isCheat: claimRequestYesNoSchema.nullable().optional(),
    lname: z.string().nullable().optional(),
    mobileNumber: z.string().nullable().optional(),
    nationalityType: nationalityTypeSchema.nullable().optional(),
    parentUserAccountId: z.uuid().nullable().optional(),
    roles: z.array(partyRoleSchema).nullable().optional(),
    specialDiseases: z.array(personSpecialDiseaseEnumSchema).optional(),
    updatedAt: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    username: z.string(),
  })
  .loose()

export const loginRequestSchema = z.object({
  password: z.string().nonempty(),
  username: z.string().nonempty(),
})

export const loginResponseSchema = z.object({
  expiresIn: z.number().optional(),
  token: z.string(),
  tokenType: z.string().optional(),
  user: authUserSchema,
})

export const ssoLoginRequestSchema = z.object({ token: z.string() })

export const registrationIdentitySchema = z.discriminatedUnion(
  'nationalityType',
  [
    z.object({
      nationalCode: iranianNationalCodeSchema,
      nationalityType: z.literal('IR'),
      phoneNumber: mobilePhoneSchema,
    }),
    z.object({
      nationalCode: z.string(),
      nationalityType: z.literal('FOREIGN'),
      phoneNumber: mobilePhoneSchema,
    }),
  ]
)

export const verifyRegistrationRequestSchema = z.discriminatedUnion(
  'nationalityType',
  [
    z.object({
      nationalCode: iranianNationalCodeSchema,
      nationalityType: z.literal('IR'),
      otpCode: otpCodeSchema,
      password: passwordSchema,
      phoneNumber: mobilePhoneSchema,
    }),
    z.object({
      nationalCode: z.string(),
      nationalityType: z.literal('FOREIGN'),
      otpCode: otpCodeSchema,
      password: passwordSchema,
      phoneNumber: mobilePhoneSchema,
    }),
  ]
)

export const passwordResetIdentitySchema = z.object({
  mobileNumber: mobilePhoneSchema,
  nationalCode: z.string().min(10).max(10),
})

export const resetPasswordRequestSchema = passwordResetIdentitySchema.extend({
  otpCode: otpCodeSchema,
  password: passwordSchema,
})

export const emptyAuthResponseSchema = z.undefined()

export type AuthUser = z.infer<typeof authUserSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type SsoLoginRequest = z.infer<typeof ssoLoginRequestSchema>
export type RegistrationIdentity = z.infer<typeof registrationIdentitySchema>
export type VerifyRegistrationRequest = z.infer<
  typeof verifyRegistrationRequestSchema
>
export type PasswordResetIdentity = z.infer<typeof passwordResetIdentitySchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>
