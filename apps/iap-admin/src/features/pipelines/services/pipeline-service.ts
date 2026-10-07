import { getApiClient } from '@iap/api-client'

import {
  type PipelineJobExecutionsRequest,
  type RestartPipelineExecutionRequest,
  type StartPipelineJobRequest,
  type StopPipelineExecutionRequest,
  pipelineJobExecutionsRequestSchema,
  pipelineJobExecutionsResponseSchema,
  pipelineJobsRequestSchema,
  pipelineJobsResponseSchema,
  restartPipelineExecutionRequestSchema,
  restartPipelineExecutionResponseSchema,
  startPipelineJobRequestSchema,
  startPipelineJobResponseSchema,
  stopPipelineExecutionRequestSchema,
  stopPipelineExecutionResponseSchema,
} from '../data/pipeline-schema'

export const pipelineService = {
  getJobs: async (options?: { signal?: AbortSignal }) => {
    pipelineJobsRequestSchema.parse({})
    const response = await getApiClient().get('/lo/jobs', {
      signal: options?.signal,
    })

    return pipelineJobsResponseSchema.parse(response.data)
  },

  getExecutions: async (
    request: PipelineJobExecutionsRequest,
    options?: { signal?: AbortSignal }
  ) => {
    const { jobName } = pipelineJobExecutionsRequestSchema.parse(request)
    const response = await getApiClient().get(
      `/lo/jobs/${encodeURIComponent(jobName)}/executions`,
      { signal: options?.signal }
    )

    return pipelineJobExecutionsResponseSchema.parse(response.data)
  },

  start: async (request: StartPipelineJobRequest) => {
    const { jobName } = startPipelineJobRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/lo/jobs/${encodeURIComponent(jobName)}/executions`
    )

    return startPipelineJobResponseSchema.parse(response.data)
  },

  stop: async (request: StopPipelineExecutionRequest) => {
    const { executionId } = stopPipelineExecutionRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/lo/executions/${executionId}/stop`
    )

    return stopPipelineExecutionResponseSchema.parse(response.data)
  },

  restart: async (request: RestartPipelineExecutionRequest) => {
    const { executionId } = restartPipelineExecutionRequestSchema.parse(request)
    const response = await getApiClient().post(
      `/lo/executions/${executionId}/restart`
    )

    return restartPipelineExecutionResponseSchema.parse(response.data)
  },
}

export default pipelineService
