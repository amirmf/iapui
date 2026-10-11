import { getApiClient } from '@iap/api-client'
import {
  type AgentSignupRequest,
  agentSignupRequestSchema,
  agentSignupResponseSchema,
} from '@iap/api-types'
import { useAuthStore } from '@iap/auth'
import { CanceledError } from 'axios'

export const agentUserService = {
  signup: async (payload: AgentSignupRequest): Promise<void> => {
    const request = agentSignupRequestSchema.parse(payload)
    if (useAuthStore.getState().user?.isPasswordChangeForced === 'Y') {
      throw new CanceledError(
        'Password change is required before other requests.'
      )
    }

    const response = await getApiClient().post(
      '/claim-request-registery-agent/users',
      request
    )

    agentSignupResponseSchema.parse(
      response.data === '' ? undefined : response.data
    )
  },
}

export default agentUserService
