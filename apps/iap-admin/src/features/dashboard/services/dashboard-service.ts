import { getApiClient } from '@iap/api-client'
import {
  type DashboardFilters,
  agreementsWithoutMainAssessmentUserRequestSchema,
  agreementsWithoutMainAssessmentUserResponseSchema,
  assigneeStatusCountReportListSchema,
  assigneeStatusSumReportListSchema,
  dashboardReportRequestSchema,
  pageDocTypeRequestSchema,
  pageDocTypeSchema,
  reportDistributionByStatusRequestSchema,
  statusDistributionReportListSchema,
  statusDocTypeCountReportListSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'
import { z } from 'zod'

type RequestOptions = {
  filters?: DashboardFilters
  signal?: AbortSignal
}

async function getReport<TResponse>(
  path: string,
  options: RequestOptions,
  responseSchema: z.ZodType<TResponse>
) {
  const request = dashboardReportRequestSchema.parse({
    filters: options.filters ?? {},
  })
  const response = await getApiClient().get(path, {
    params: transformApiFilterParams(request.filters),
    signal: options.signal,
  })

  return responseSchema.parse(response.data)
}

export const dashboardService = {
  findDocTypes: async (options?: { signal?: AbortSignal }) => {
    const request = pageDocTypeRequestSchema.parse({ page: 0, size: 100 })
    const response = await getApiClient().get('/doc-types/page', {
      params: request,
      signal: options?.signal,
    })

    return pageDocTypeSchema.parse(response.data).content
  },
  findAgreementsWithoutMainAssessmentUser: async (
    options?: { signal?: AbortSignal } | AbortSignal
  ) => {
    agreementsWithoutMainAssessmentUserRequestSchema.parse({})
    const signal = options instanceof AbortSignal ? options : options?.signal
    const response = await getApiClient().get(
      '/agreements/reports/without-main-assessment-user',
      { signal }
    )

    return agreementsWithoutMainAssessmentUserResponseSchema.parse(
      response.data
    )
  },
  reportCountByAssignee: (options: RequestOptions) =>
    getReport(
      '/claim-requests/reports/count-by-assignee',
      options,
      assigneeStatusCountReportListSchema
    ),
  reportCountByAssigneeSummary: (options: RequestOptions) =>
    getReport(
      '/claim-requests/reports/count-by-assignee-summary',
      options,
      assigneeStatusCountReportListSchema
    ),
  reportCountByStatus: (options: RequestOptions) =>
    getReport(
      '/claim-requests/reports/count-by-status',
      options,
      statusDocTypeCountReportListSchema
    ),
  reportDistributionByStatus: async (options: RequestOptions) => {
    const request = reportDistributionByStatusRequestSchema.parse({
      filters: options.filters ?? {},
    })
    const response = await getApiClient().get(
      '/claim-requests/reports/distribution-by-status',
      {
        params: transformApiFilterParams(request.filters),
        signal: options.signal,
      }
    )

    return statusDistributionReportListSchema.parse(response.data)
  },
  reportSumByAssignee: (options: RequestOptions) =>
    getReport(
      '/claim-requests/reports/sum-by-assignee',
      options,
      assigneeStatusSumReportListSchema
    ),
}

export default dashboardService
