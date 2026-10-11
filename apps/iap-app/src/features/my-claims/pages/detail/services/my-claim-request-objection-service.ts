import { getApiClient } from '@iap/api-client'
import {
  type MyClaimRequestObjectionRequest,
  claimRequestSchema,
  myClaimRequestObjectionRequestSchema,
} from '@iap/api-types'

const myClaimRequestService = {
  submitObjection: async (payload: MyClaimRequestObjectionRequest) => {
    const body = myClaimRequestObjectionRequestSchema.parse(payload)
    const response = await getApiClient().post<unknown>(
      '/my/iap/claim-requests/objections',
      body
    )
    return claimRequestSchema.parse(response.data)
  },
}
export default myClaimRequestService
