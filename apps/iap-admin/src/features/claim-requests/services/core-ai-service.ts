import { getApiClient } from '@iap/api-client'
import {
  type CoreAiDataExtractionRequest,
  coreAiDataExtractionBulkRequestSchema,
  coreAiDataExtractionBulkResponseSchema,
} from '@iap/api-types'

export const coreAiService = {
  bulkStartDataExtractionWorkflow: async (
    payloads: CoreAiDataExtractionRequest[]
  ) => {
    const request = coreAiDataExtractionBulkRequestSchema.parse(
      payloads.map((payload) => ({
        claimRequestId: payload.claimRequestId.trim(),
        workflowId: payload.workflowId.trim(),
        initiatedBy: payload.initiatedBy.trim(),
      }))
    )
    const response = await getApiClient().post(
      '/core-ai/workflows/data-extraction/start/bulk',
      request
    )
    return coreAiDataExtractionBulkResponseSchema.parse(response.data)
  },
}

export default coreAiService
