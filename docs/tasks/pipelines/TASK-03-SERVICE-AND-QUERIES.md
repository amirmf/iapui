# TASK-03: Service and Queries

Status: Completed

## Goal
Implement the API service layer calling backend endpoints via `@iap/api-client` and TanStack Query hooks in `iap-admin`.

## Reference Source
- `insurance-ui/src/features/pipelines/services/pipeline-service.ts`
- `insurance-ui/src/features/pipelines/hooks/use-pipelines.ts`

## Target File Locations
- `apps/iap-admin/src/features/pipelines/services/pipeline-service.ts`
- `apps/iap-admin/src/features/pipelines/services/pipeline-service.test.ts`
- `apps/iap-admin/src/features/pipelines/queries/use-pipelines.ts`

## Details

### 1. `pipeline-service.ts`
Uses `getApiClient()` from `@iap/api-client`.
- `getJobs(options?: { signal?: AbortSignal })`:
  - Validates `{}` with `pipelineJobsRequestSchema`.
  - `GET /lo/jobs`
  - Validates and returns `pipelineJobsResponseSchema.parse(response.data)`.
- `getExecutions(request: PipelineJobExecutionsRequest, options?: { signal?: AbortSignal })`:
  - Validates `request` with `pipelineJobExecutionsRequestSchema`.
  - `GET /lo/jobs/${encodeURIComponent(jobName)}/executions`
  - Validates and returns `pipelineJobExecutionsResponseSchema.parse(response.data)`.
- `start(request: StartPipelineJobRequest)`:
  - Validates `request` with `startPipelineJobRequestSchema`.
  - `POST /lo/jobs/${encodeURIComponent(jobName)}/executions`
  - Validates and returns `startPipelineJobResponseSchema.parse(response.data)`.
- `stop(request: StopPipelineExecutionRequest)`:
  - Validates `request` with `stopPipelineExecutionRequestSchema`.
  - `POST /lo/executions/${executionId}/stop`
  - Validates and returns `stopPipelineExecutionResponseSchema.parse(response.data)`.
- `restart(request: RestartPipelineExecutionRequest)`:
  - Validates `request` with `restartPipelineExecutionRequestSchema`.
  - `POST /lo/executions/${executionId}/restart`
  - Validates and returns `restartPipelineExecutionResponseSchema.parse(response.data)`.

### 2. `use-pipelines.ts`
- `pipelineQueryKeys`:
  - `all: ['pipelines'] as const`
  - `jobs: () => [...pipelineQueryKeys.all, 'jobs'] as const`
  - `executions: (jobName: string) => [...pipelineQueryKeys.all, 'jobs', jobName, 'executions'] as const`
- `usePipelineJobs()`:
  - `queryKey: pipelineQueryKeys.jobs()`
  - `queryFn: ({ signal }) => pipelineService.getJobs({ signal })`
- `usePipelineExecutions(jobName: string | null)`:
  - `queryKey: pipelineQueryKeys.executions(jobName ?? '')`
  - `queryFn: ({ signal }) => pipelineService.getExecutions({ jobName: jobName ?? '' }, { signal })`
  - `enabled: Boolean(jobName)`

## Acceptance Criteria
- Endpoints and methods match OpenAPI and reference project exactly (`/lo/jobs`, `/lo/jobs/:jobName/executions`, `/lo/executions/:executionId/stop`, `/lo/executions/:executionId/restart`).
- Input validation and response schema parsing on every operation.
- AbortSignal forwarded on GET operations.
- Comprehensive unit tests in `pipeline-service.test.ts`.
