import { beforeEach, describe, expect, it, vi } from 'vitest'

import { pipelineService } from './pipeline-service'

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({
  getApiClient: () => apiClient,
}))

describe('pipelineService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getJobs', () => {
    it('calls GET /lo/jobs and validates response', async () => {
      const signal = new AbortController().signal
      apiClient.get.mockResolvedValueOnce({
        data: ['reporting-job-1', 'reporting-job-2'],
      })

      const result = await pipelineService.getJobs({ signal })

      expect(apiClient.get).toHaveBeenCalledWith('/lo/jobs', { signal })
      expect(result).toEqual(['reporting-job-1', 'reporting-job-2'])
    })

    it('rejects invalid jobs response', async () => {
      apiClient.get.mockResolvedValueOnce({
        data: 'not-an-array',
      })

      await expect(pipelineService.getJobs()).rejects.toThrow()
    })
  })

  describe('getExecutions', () => {
    it('encodes jobName and calls GET /lo/jobs/:jobName/executions', async () => {
      const signal = new AbortController().signal
      const mockExecutions = [
        {
          executionId: 101,
          status: 'COMPLETED',
          startTime: '2026-10-06T10:00:00Z',
        },
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockExecutions })

      const result = await pipelineService.getExecutions(
        { jobName: 'job with spaces/slash' },
        { signal }
      )

      expect(apiClient.get).toHaveBeenCalledWith(
        '/lo/jobs/job%20with%20spaces%2Fslash/executions',
        { signal }
      )
      expect(result).toEqual(mockExecutions)
    })

    it('rejects empty jobName', async () => {
      await expect(
        pipelineService.getExecutions({ jobName: '' })
      ).rejects.toThrow()
    })
  })

  describe('start', () => {
    it('calls POST /lo/jobs/:jobName/executions', async () => {
      const mockExecution = { executionId: 202, status: 'STARTING' }
      apiClient.post.mockResolvedValueOnce({ data: mockExecution })

      const result = await pipelineService.start({ jobName: 'my-job' })

      expect(apiClient.post).toHaveBeenCalledWith('/lo/jobs/my-job/executions')
      expect(result).toEqual(mockExecution)
    })

    it('rejects empty jobName', async () => {
      await expect(pipelineService.start({ jobName: '' })).rejects.toThrow()
    })
  })

  describe('stop', () => {
    it('calls POST /lo/executions/:executionId/stop', async () => {
      apiClient.post.mockResolvedValueOnce({ data: undefined })

      const result = await pipelineService.stop({ executionId: 101 })

      expect(apiClient.post).toHaveBeenCalledWith('/lo/executions/101/stop')
      expect(result).toBeUndefined()
    })

    it('rejects non-integer executionId', async () => {
      await expect(
        pipelineService.stop({ executionId: 101.5 as never })
      ).rejects.toThrow()
    })
  })

  describe('restart', () => {
    it('calls POST /lo/executions/:executionId/restart', async () => {
      const mockExecution = { executionId: 303, status: 'STARTED' }
      apiClient.post.mockResolvedValueOnce({ data: mockExecution })

      const result = await pipelineService.restart({ executionId: 101 })

      expect(apiClient.post).toHaveBeenCalledWith('/lo/executions/101/restart')
      expect(result).toEqual(mockExecution)
    })

    it('rejects non-integer executionId', async () => {
      await expect(
        pipelineService.restart({ executionId: NaN as never })
      ).rejects.toThrow()
    })
  })
})
