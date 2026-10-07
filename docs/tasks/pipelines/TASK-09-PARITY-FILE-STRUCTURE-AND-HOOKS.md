# TASK-09: Parity File Structure and Hooks

Status: Completed

## Scope
Align feature file structure and public paths with `insurance-ui`:
1. `src/features/pipelines/data/pipeline-schema.ts`: Re-export all schemas and inferred types from `@iap/api-types` (`pipelineJobsRequestSchema`, `pipelineJobsResponseSchema`, `pipelineJobExecutionsRequestSchema`, `pipelineExecutionSchema`, `pipelineJobExecutionsResponseSchema`, `startPipelineJobRequestSchema`, `startPipelineJobResponseSchema`, `stopPipelineExecutionRequestSchema`, `stopPipelineExecutionResponseSchema`, `restartPipelineExecutionRequestSchema`, `restartPipelineExecutionResponseSchema`, and their TypeScript types).
2. `src/features/pipelines/hooks/use-pipelines.ts`: Provide `pipelineQueryKeys`, `usePipelineJobs`, and `usePipelineExecutions` with exact reference signatures and paths.
3. `src/features/pipelines/pages/pipelines-page.tsx`: Position the page component under `pages/` with `export default function PipelinesPage()` and named export, re-exported at feature root.
4. Route import: Update route file to import `PipelinesPage` from `@features/pipelines/pages/pipelines-page`.
