import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { dashboardService } from './dashboard-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('dashboardService', () => {
  const mockGet = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getApiClient).mockReturnValue({
      get: mockGet,
    } as never)
  })

  describe('findAgreementsWithoutMainAssessmentUser', () => {
    it('forwards signal and parses valid response', async () => {
      const signal = new AbortController().signal
      mockGet.mockResolvedValueOnce({
        data: [
          {
            code: 'AG-001',
            id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'ACTIVE',
            title: 'Agreement 1',
          },
        ],
      })

      const result =
        await dashboardService.findAgreementsWithoutMainAssessmentUser({
          signal,
        })
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Agreement 1')
      expect(mockGet).toHaveBeenCalledWith(
        '/agreements/reports/without-main-assessment-user',
        { signal }
      )
    })
  })

  describe('reportDistributionByStatus', () => {
    it('serializes filters and parses response', async () => {
      mockGet.mockResolvedValueOnce({
        data: [
          {
            amount: 150.5,
            count: 2,
            status: 'SUBMITTED',
            totalSumAmount: 100,
          },
        ],
      })

      const result = await dashboardService.reportDistributionByStatus({
        filters: {
          extCustomerId: 'cust-1',
          status: ['SUBMITTED', 'APPROVED'],
        },
      })

      expect(result).toEqual([
        {
          amount: 150.5,
          count: 2,
          status: 'SUBMITTED',
          totalSumAmount: 100,
        },
      ])
      expect(mockGet).toHaveBeenCalledWith(
        '/claim-requests/reports/distribution-by-status',
        {
          params: {
            extCustomerId: 'cust-1',
            status__in: 'SUBMITTED,APPROVED',
          },
          signal: undefined,
        }
      )
    })
  })

  describe('reportCountByAssignee', () => {
    it('calls count-by-assignee and parses response', async () => {
      mockGet.mockResolvedValueOnce({
        data: [
          {
            assignedUserDisplayName: 'John Doe',
            assignedUserUsername: '1234567890',
            count: 5,
            status: 'APPROVED',
          },
        ],
      })

      const result = await dashboardService.reportCountByAssignee({
        filters: {},
      })

      expect(result).toEqual([
        {
          assignedUserDisplayName: 'John Doe',
          assignedUserUsername: '1234567890',
          count: 5,
          status: 'APPROVED',
        },
      ])
      expect(mockGet).toHaveBeenCalledWith(
        '/claim-requests/reports/count-by-assignee',
        { params: {}, signal: undefined }
      )
    })
  })

  describe('reportCountByAssigneeSummary', () => {
    it('calls count-by-assignee-summary and parses response', async () => {
      mockGet.mockResolvedValueOnce({
        data: [
          {
            assignedUserDisplayName: 'Jane Doe',
            count: 10,
            status: 'APPROVED',
          },
        ],
      })

      const result = await dashboardService.reportCountByAssigneeSummary({
        filters: {},
      })

      expect(result).toHaveLength(1)
      expect(mockGet).toHaveBeenCalledWith(
        '/claim-requests/reports/count-by-assignee-summary',
        { params: {}, signal: undefined }
      )
    })
  })

  describe('reportSumByAssignee', () => {
    it('calls sum-by-assignee and parses response', async () => {
      mockGet.mockResolvedValueOnce({
        data: [
          {
            amount: 5000,
            assignedUserDisplayName: 'John Doe',
            totalSumAmount: 4000,
          },
        ],
      })

      const result = await dashboardService.reportSumByAssignee({
        filters: {},
      })

      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(5000)
      expect(mockGet).toHaveBeenCalledWith(
        '/claim-requests/reports/sum-by-assignee',
        { params: {}, signal: undefined }
      )
    })
  })
})
