import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { aiAssessmentRuleService } from './ai-assessment-rule-service'

vi.mock('@iap/api-client', () => {
  const get = vi.fn()
  const post = vi.fn()
  const put = vi.fn()
  const del = vi.fn()
  return {
    getApiClient: () => ({
      delete: del,
      get,
      post,
      put,
    }),
  }
})

describe('aiAssessmentRuleService', () => {
  const client = getApiClient()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists rules with page-full and transforms filters', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 'rule-1',
            status: 'ACTIVE',
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 1,
        size: 30,
        totalElements: 1,
        totalPages: 1,
      },
    })

    const result = await aiAssessmentRuleService.list({
      filters: { definitionType: 'GENERAL' },
      page: 0,
      size: 30,
    })

    expect(client.get).toHaveBeenCalledWith(
      '/ai-assessment-rules/page-full',
      expect.objectContaining({
        params: expect.objectContaining({
          definitionType: 'GENERAL',
          page: 0,
          size: 30,
        }),
      })
    )
    expect(result.content?.[0]?.id).toBe('rule-1')
  })

  it('gets rule by ID', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        id: 'rule-1',
        status: 'ACTIVE',
      },
    })

    const result = await aiAssessmentRuleService.getById('rule-1')
    expect(client.get).toHaveBeenCalledWith(
      '/ai-assessment-rules/rule-1',
      expect.anything()
    )
    expect(result.id).toBe('rule-1')
  })

  it('creates rule', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        id: 'rule-created',
        status: 'ACTIVE',
      },
    })

    const result = await aiAssessmentRuleService.create({
      status: 'ACTIVE',
    })
    expect(client.post).toHaveBeenCalledWith(
      '/ai-assessment-rules',
      expect.objectContaining({ status: 'ACTIVE' })
    )
    expect(result.id).toBe('rule-created')
  })

  it('updates rule', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: {
        id: 'rule-1',
        status: 'INACTIVE',
      },
    })

    const result = await aiAssessmentRuleService.update({
      data: { status: 'INACTIVE' },
      id: 'rule-1',
    })
    expect(client.put).toHaveBeenCalledWith(
      '/ai-assessment-rules/rule-1',
      expect.objectContaining({ status: 'INACTIVE' })
    )
    expect(result.status).toBe('INACTIVE')
  })

  it('deletes rule', async () => {
    vi.mocked(client.delete).mockResolvedValueOnce({ data: '' })
    await aiAssessmentRuleService.delete('rule-1')
    expect(client.delete).toHaveBeenCalledWith('/ai-assessment-rules/rule-1')
  })

  it('bulk deletes rules', async () => {
    vi.mocked(client.delete).mockResolvedValueOnce({ data: '' })
    await aiAssessmentRuleService.bulkDelete(['rule-1', 'rule-2'])
    expect(client.delete).toHaveBeenCalledWith(
      '/ai-assessment-rules/bulk-delete',
      { data: ['rule-1', 'rule-2'] }
    )
  })
})
