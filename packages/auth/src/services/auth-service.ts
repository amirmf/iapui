import { getApiClient } from '@iap/api-client'
import type {
  ChangePasswordRequest,
  LoginRequest,
  PasswordResetIdentity,
  RegistrationIdentity,
  ResetPasswordRequest,
  SsoLoginRequest,
  VerifyRegistrationRequest,
} from '@iap/api-types'
import {
  authUserSchema,
  changePasswordRequestSchema,
  emptyAuthResponseSchema,
  getCurrentUserRequestSchema,
  getUserByIdRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
  passwordResetIdentitySchema,
  registrationIdentitySchema,
  resetPasswordRequestSchema,
  ssoLoginRequestSchema,
  userAccountSchema,
  verifyRegistrationRequestSchema,
} from '@iap/api-types'

const timeout = 60_000

const config = { timeout, withCredentials: true }

const parseEmptyResponse = (data: unknown): void => {
  emptyAuthResponseSchema.parse(data === '' ? undefined : data)
}

export const authService = {
  async changePassword(payload: ChangePasswordRequest) {
    const response = await getApiClient().post(
      '/auth/change-password',
      changePasswordRequestSchema.parse(payload),
      config
    )
    return loginResponseSchema.parse(response.data)
  },
  async getCurrentUser() {
    getCurrentUserRequestSchema.parse({})
    const response = await getApiClient().get('/auth/me', config)
    return authUserSchema.parse(response.data)
  },
  async getUserById(id: string, signal?: AbortSignal) {
    const request = getUserByIdRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/auth/users/${request.path.id}`,
      {
        signal,
      }
    )
    return userAccountSchema.parse(response.data)
  },
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
    parseEmptyResponse(response.data)
  },
  async requestSignupOtp(payload: RegistrationIdentity) {
    const response = await getApiClient().post(
      '/auth/signup/otp/request',
      registrationIdentitySchema.parse(payload),
      config
    )
    parseEmptyResponse(response.data)
  },
  async resetPassword(payload: ResetPasswordRequest) {
    const response = await getApiClient().post(
      '/auth/password-reset',
      resetPasswordRequestSchema.parse(payload),
      config
    )
    parseEmptyResponse(response.data)
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
