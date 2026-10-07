import { useQuery } from '@tanstack/react-query'

import pipelineService from '../services/pipeline-service'

export const pipelineQueryKeys = {
  all: ['pipelines'] as const,
  jobs: () => [...pipelineQueryKeys.all, 'jobs'] as const,
  executions: (jobName: string) =>
    [...pipelineQueryKeys.all, 'jobs', jobName, 'executions'] as const,
}

export function usePipelineJobs() {
  return useQuery({
    queryKey: pipelineQueryKeys.jobs(),
    queryFn: ({ signal }) => pipelineService.getJobs({ signal }),
  })
}

export function usePipelineExecutions(jobName: string | null) {
  return useQuery({
    queryKey: pipelineQueryKeys.executions(jobName ?? ''),
    queryFn: ({ signal }) =>
      pipelineService.getExecutions({ jobName: jobName ?? '' }, { signal }),
    enabled: Boolean(jobName),
  })
}
