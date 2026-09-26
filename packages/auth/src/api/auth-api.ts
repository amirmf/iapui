import { getApiClient } from '@iap/api-client'
import type {
  LoginRequest,
  PasswordResetIdentity,
  RegistrationIdentity,
  ResetPasswordRequest,
  SsoLoginRequest,
  VerifyRegistrationRequest,
} from '@iap/api-types'
import {
  authUserSchema,
  emptyAuthResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  passwordResetIdentitySchema,
  registrationIdentitySchema,
  resetPasswordRequestSchema,
  ssoLoginRequestSchema,
  verifyRegistrationRequestSchema,
} from '@iap/api-types'

const timeout = 60_000

const config = { timeout, withCredentials: true }

export const authService = {
  async login(payload: LoginRequest) {
    const response = await getApiClient().post(
      '/auth/login',
      loginRequestSchema.parse(payload),
      config
    )
    return loginResponseSchema.parse(response.data)
  },
  async requestPasswordResetOtp(payload: PasswordResetIdentity) {
    const response = await getApiClient().post(
      '/auth/password-reset/otp',
      passwordResetIdentitySchema.parse(payload),
      config
    )
    emptyAuthResponseSchema.parse(response.data)
  },
  async requestSignupOtp(payload: RegistrationIdentity) {
    const response = await getApiClient().post(
      '/auth/signup/otp/request',
      registrationIdentitySchema.parse(payload),
      config
    )
    emptyAuthResponseSchema.parse(response.data)
  },
  async resetPassword(payload: ResetPasswordRequest) {
    const response = await getApiClient().post(
      '/auth/password-reset',
      resetPasswordRequestSchema.parse(payload),
      config
    )
    emptyAuthResponseSchema.parse(response.data)
  },
  async ssoLogin(payload: SsoLoginRequest) {
    const response = await getApiClient().post(
      '/auth/login/sso/alborz/yaghoot',
      ssoLoginRequestSchema.parse(payload),
      config
    )
    return loginResponseSchema.parse(response.data)
  },
  async verifySignupOtp(payload: VerifyRegistrationRequest) {
    const response = await getApiClient().post(
      '/auth/signup/otp/verify',
      verifyRegistrationRequestSchema.parse(payload),
      config
    )
    return authUserSchema.parse(response.data)
  },
}
