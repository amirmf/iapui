import { getApiClient } from '@iap/api-client'
import {
  type PaymentCalculationRequest,
  type PaymentCalculationResponse,
  paymentCalculationRequestSchema,
  paymentCalculationResponseSchema,
} from '@iap/api-types'

const CALCULATE_PAYMENT_ENDPOINT = '/claim-payments/calculate'

export const claimPaymentService = {
  calculate: async (
    payload: PaymentCalculationRequest
  ): Promise<PaymentCalculationResponse> => {
    const body = paymentCalculationRequestSchema.parse(payload)
    const response = await getApiClient().post(CALCULATE_PAYMENT_ENDPOINT, body)
    return paymentCalculationResponseSchema.parse(response.data)
  },
}

export default claimPaymentService
