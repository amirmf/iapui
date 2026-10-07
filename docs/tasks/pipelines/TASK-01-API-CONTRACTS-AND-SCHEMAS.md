# TASK-01: API Contracts and Schemas

Status: Completed

## Goal
Port the exact API contract schemas and inferred TypeScript types from `insurance-ui` into `@iap/api-types`.

## Reference Source
- `insurance-ui/src/features/pipelines/data/pipeline-schema.ts`
- `openapidoc.json` (`/api/lo/jobs`, `/api/lo/jobs/{jobName}/executions`, `/api/lo/executions/{executionId}/stop`, `/api/lo/executions/{executionId}/restart`)

## Target File Locations
- `packages/api-types/src/pipeline/index.ts`
- `packages/api-types/src/index.ts` (re-export all symbols)

## Contracts Specification

1. **Pipeline Jobs**
   - `pipelineJobsRequestSchema`: `z.object({}).strict()`
   - `pipelineJobsResponseSchema`: `z.array(z.string())`
   - Types: `PipelineJobsRequest`, `PipelineJobsResponse`

2. **Pipeline Job Executions**
   - `pipelineJobExecutionsRequestSchema`: `z.object({ jobName: z.string().min(1) })`
   - `pipelineExecutionSchema`: `z.record(z.string(), z.unknown())` (preserves free-form spring batch execution diagnostics intact)
   - `pipelineJobExecutionsResponseSchema`: `z.array(pipelineExecutionSchema)`
   - Types: `PipelineJobExecutionsRequest`, `PipelineExecution`, `PipelineJobExecutionsResponse`

3. **Start Pipeline Job**
   - `startPipelineJobRequestSchema`: `pipelineJobExecutionsRequestSchema`
   - `startPipelineJobResponseSchema`: `pipelineExecutionSchema`
   - Types: `StartPipelineJobRequest`, `StartPipelineJobResponse`

4. **Stop Pipeline Execution**
   - `stopPipelineExecutionRequestSchema`: `z.object({ executionId: z.number().int() })`
   - `stopPipelineExecutionResponseSchema`: `z.union([z.undefined(), z.literal(''), z.null()])` (compatible with 200 OK without body)
   - Types: `StopPipelineExecutionRequest`, `StopPipelineExecutionResponse`

5. **Restart Pipeline Execution**
   - `restartPipelineExecutionRequestSchema`: `stopPipelineExecutionRequestSchema`
   - `restartPipelineExecutionResponseSchema`: `pipelineExecutionSchema`
   - Types: `RestartPipelineExecutionRequest`, `RestartPipelineExecutionResponse`

## Acceptance Criteria
- Uses Zod v4 from `zod`.
- Export names and property validations match reference exactly.
- Re-exported through `@iap/api-types` root barrel `packages/api-types/src/index.ts`.
- `pnpm --filter @iap/api-types typecheck` passes with 0 errors.
