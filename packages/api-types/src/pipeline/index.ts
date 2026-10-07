import { z } from 'zod'

export const pipelineJobsRequestSchema = z.object({}).strict()
export const pipelineJobsResponseSchema = z.array(z.string())

export const pipelineJobExecutionsRequestSchema = z.object({
  jobName: z.string().min(1),
})

// The API documents execution values as free-form object maps. Keep them intact
// so the operations UI does not discard backend-provided diagnostics.
export const pipelineExecutionSchema = z.record(z.string(), z.unknown())
export const pipelineJobExecutionsResponseSchema = z.array(
  pipelineExecutionSchema
)

export const startPipelineJobRequestSchema = pipelineJobExecutionsRequestSchema
export const startPipelineJobResponseSchema = pipelineExecutionSchema

export const stopPipelineExecutionRequestSchema = z.object({
  executionId: z.number().int(),
})
export const stopPipelineExecutionResponseSchema = z.union([
  z.undefined(),
  z.literal(''),
  z.null(),
])

export const restartPipelineExecutionRequestSchema =
  stopPipelineExecutionRequestSchema
export const restartPipelineExecutionResponseSchema = pipelineExecutionSchema

export type PipelineJobsRequest = z.infer<typeof pipelineJobsRequestSchema>
export type PipelineJobsResponse = z.infer<typeof pipelineJobsResponseSchema>
export type PipelineJobExecutionsRequest = z.infer<
  typeof pipelineJobExecutionsRequestSchema
>
export type PipelineJobExecutionsResponse = z.infer<
  typeof pipelineJobExecutionsResponseSchema
>
export type PipelineExecution = z.infer<typeof pipelineExecutionSchema>
export type StartPipelineJobRequest = z.infer<
  typeof startPipelineJobRequestSchema
>
export type StartPipelineJobResponse = z.infer<
  typeof startPipelineJobResponseSchema
>
export type StopPipelineExecutionRequest = z.infer<
  typeof stopPipelineExecutionRequestSchema
>
export type StopPipelineExecutionResponse = z.infer<
  typeof stopPipelineExecutionResponseSchema
>
export type RestartPipelineExecutionRequest = z.infer<
  typeof restartPipelineExecutionRequestSchema
>
export type RestartPipelineExecutionResponse = z.infer<
  typeof restartPipelineExecutionResponseSchema
>
