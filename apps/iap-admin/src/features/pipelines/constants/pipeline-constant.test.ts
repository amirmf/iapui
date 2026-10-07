import { describe, expect, it } from 'vitest'

import {
  PIPELINE_EXECUTION_ID_KEYS,
  getPipelineExecutionStatusVariant,
} from './pipeline-constant'

describe('pipeline-constant', () => {
  it('defines the execution id keys fallback list', () => {
    expect(PIPELINE_EXECUTION_ID_KEYS).toEqual(['executionId', 'id'])
  })

  it('maps failing and stopping statuses to destructive variant', () => {
    expect(getPipelineExecutionStatusVariant('FAILED')).toBe('destructive')
    expect(getPipelineExecutionStatusVariant('STOPPED')).toBe('destructive')
    expect(getPipelineExecutionStatusVariant('STOPPING')).toBe('destructive')
    expect(getPipelineExecutionStatusVariant('fail')).toBe('destructive')
  })

  it('maps completed and success statuses to secondary variant', () => {
    expect(getPipelineExecutionStatusVariant('COMPLETED')).toBe('secondary')
    expect(getPipelineExecutionStatusVariant('SUCCESS')).toBe('secondary')
    expect(getPipelineExecutionStatusVariant('complete')).toBe('secondary')
  })

  it('maps unknown and running statuses to outline variant', () => {
    expect(getPipelineExecutionStatusVariant('STARTED')).toBe('outline')
    expect(getPipelineExecutionStatusVariant('STARTING')).toBe('outline')
    expect(getPipelineExecutionStatusVariant('UNKNOWN')).toBe('outline')
    expect(getPipelineExecutionStatusVariant('')).toBe('outline')
  })
})
