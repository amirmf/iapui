import { z } from 'zod'

export const nationalityTypeSchema = z.enum(['IR', 'FOREIGN'])

export const authUserSchema = z
  .object({
    displayName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    id: z.uuid(),
    mobileNumber: z.string().nullable().optional(),
    roles: z.array(z.unknown()).nullable().optional(),
    username: z.string(),
  })
  .loose()

export const loginRequestSchema = z.object({
  password: z.string(),
  username: z.string(),
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
      nationalCode: z.string(),
      nationalityType: z.literal('IR'),
      phoneNumber: z.string(),
    }),
    z.object({
      nationalCode: z.string(),
      nationalityType: z.literal('FOREIGN'),
      phoneNumber: z.string(),
    }),
  ]
)

export const verifyRegistrationRequestSchema = registrationIdentitySchema.and(
  z.object({ otpCode: z.string(), password: z.string() })
)

export const passwordResetIdentitySchema = z.object({
  mobileNumber: z.string(),
  nationalCode: z.string(),
})

export const resetPasswordRequestSchema = passwordResetIdentitySchema.extend({
  otpCode: z.string(),
  password: z.string(),
})

export const emptyAuthResponseSchema = z.undefined().or(z.literal(''))

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
