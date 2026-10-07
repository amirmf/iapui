import { getApiClient } from '@iap/api-client'
import {
  type CoreAiDataExtractionRequest,
  claimRequestVoidResponseSchema,
  coreAiDataExtractionRequestSchema,
  coreAiDataExtractionResponseSchema,
  coreAiWorkflowIdSchema,
  managementNoBodyRequestSchema,
} from '@iap/api-types'

export const coreAiManagementService = {
  startDataExtractionWorkflow: async (payload: CoreAiDataExtractionRequest) => {
    const request = coreAiDataExtractionRequestSchema.parse({
      claimRequestId: payload.claimRequestId.trim(),
      workflowId: payload.workflowId.trim(),
      initiatedBy: payload.initiatedBy.trim(),
    })
    const response = await getApiClient().post(
      '/core-ai/workflows/data-extraction/start',
      request
    )
    return coreAiDataExtractionResponseSchema.parse(response.data)
  },
  approveDataExtractionWorkflow: async (workflowId: string) => {
    const id = coreAiWorkflowIdSchema.parse(workflowId.trim())
    managementNoBodyRequestSchema.parse(undefined)
    const response = await getApiClient().post(
      `/core-ai/workflows/data-extraction/${encodeURIComponent(id)}/approve`
    )
    return claimRequestVoidResponseSchema.parse(response.data)
  },
}
export default coreAiManagementService
