import { fanhubTaminMockService } from '@features/claim-requests/pages/claim-request-management/services/fanhub-tamin-mock-service'
import { getApiClient } from '@iap/api-client'
import {
  type FanhubDrugPrescriptionResponse,
  type FanhubIhioPrintCodeInquiryRequest,
  type FanhubIhioPrintCodeInquiryResponse,
  type FanhubOfficeServiceResponse,
  type FanhubParaClinicPrescriptionResponse,
  type FanhubPrescriptionInquiryRequest,
  fanhubDrugPrescriptionResponseSchema,
  fanhubIhioPrintCodeInquiryRequestSchema,
  fanhubIhioPrintCodeInquiryResponseSchema,
  fanhubOfficeServiceResponseSchema,
  fanhubParaClinicPrescriptionResponseSchema,
  fanhubPrescriptionInquiryRequestSchema,
} from '@iap/api-types'

const apiClient = {
  post: (...args: Parameters<ReturnType<typeof getApiClient>['post']>) =>
    getApiClient().post(...args),
}
const useFanhubTaminMocks = true

export const fanhubTaminService = {
  inquireDrugPrescriptions: async (
    payload: FanhubPrescriptionInquiryRequest
  ): Promise<FanhubDrugPrescriptionResponse> => {
    const requestPayload = fanhubPrescriptionInquiryRequestSchema.parse(payload)
    if (useFanhubTaminMocks) {
      return fanhubTaminMockService.inquireDrugPrescriptions(requestPayload)
    }

    const response = await apiClient.post(
      '/claim-requests/fanhub/tamin/drug-prescriptions',
      requestPayload
    )

    return fanhubDrugPrescriptionResponseSchema.parse(response.data)
  },

  inquireParaClinicPrescriptions: async (
    payload: FanhubPrescriptionInquiryRequest
  ): Promise<FanhubParaClinicPrescriptionResponse> => {
    const requestPayload = fanhubPrescriptionInquiryRequestSchema.parse(payload)
    if (useFanhubTaminMocks) {
      return fanhubTaminMockService.inquireParaClinicPrescriptions(
        requestPayload
      )
    }

    const response = await apiClient.post(
      '/claim-requests/fanhub/tamin/para-clinic-prescriptions',
      requestPayload
    )

    return fanhubParaClinicPrescriptionResponseSchema.parse(response.data)
  },

  inquireOfficeServices: async (
    payload: FanhubPrescriptionInquiryRequest
  ): Promise<FanhubOfficeServiceResponse> => {
    const requestPayload = fanhubPrescriptionInquiryRequestSchema.parse(payload)
    if (useFanhubTaminMocks) {
      return fanhubTaminMockService.inquireOfficeServices(requestPayload)
    }

    const response = await apiClient.post(
      '/claim-requests/fanhub/tamin/office-services',
      requestPayload
    )

    return fanhubOfficeServiceResponseSchema.parse(response.data)
  },

  inquireIhioPrescriptionsByPrintCode: async (
    payload: FanhubIhioPrintCodeInquiryRequest
  ): Promise<FanhubIhioPrintCodeInquiryResponse> => {
    const requestPayload =
      fanhubIhioPrintCodeInquiryRequestSchema.parse(payload)
    if (useFanhubTaminMocks) {
      return fanhubTaminMockService.inquireIhioPrescriptionsByPrintCode(
        requestPayload
      )
    }

    const response = await apiClient.post(
      '/claim-requests/fanhub/ihio/prescriptions-by-print-code',
      requestPayload
    )

    return fanhubIhioPrintCodeInquiryResponseSchema.parse(response.data)
  },
}

export default fanhubTaminService
