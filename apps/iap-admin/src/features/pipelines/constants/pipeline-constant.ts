export const PIPELINE_EXECUTION_ID_KEYS = ['executionId', 'id'] as const

export type PipelineExecutionStatusVariant =
  'destructive' | 'secondary' | 'outline'

export function getPipelineExecutionStatusVariant(
  status: string
): PipelineExecutionStatusVariant {
  const normalized = status.toUpperCase()
  if (normalized.includes('FAIL') || normalized.includes('STOP')) {
    return 'destructive'
  }
  if (normalized.includes('COMPLETE') || normalized.includes('SUCCESS')) {
    return 'secondary'
  }
  return 'outline'
}
