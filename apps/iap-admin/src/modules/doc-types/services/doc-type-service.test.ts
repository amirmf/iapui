import { beforeEach, describe, expect, it, vi } from 'vitest'

import { docTypeService } from './doc-type-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))
vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('docTypeService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses every reference mutation endpoint', async () => {
    apiClient.get.mockResolvedValue({ data: {} })
    apiClient.post.mockResolvedValue({ data: {} })
    apiClient.patch.mockResolvedValue({ data: {} })
    apiClient.put.mockResolvedValue({ data: [] })
    await docTypeService.getById('doc-1')
    const form = {
      dataJsonSchema: '{"type":"object"}',
      docType: 'Type',
      docTypeCode: 'TYPE',
      prompt: 'Prompt',
    }
    await docTypeService.create(form)
    await docTypeService.update('doc-1', form)
    await docTypeService.updateInline('doc-1', form)
    await docTypeService.updateSchema('doc-1', '{"type":"object"}')
    await docTypeService.updateSubmissionExample('doc-1', '{"ok":true}')
    await docTypeService.delete('doc-1')
    await docTypeService.softDelete(['doc-1'], '2026-01-01')
    await docTypeService.bulkDelete(['doc-1'])
    expect(apiClient.get).toHaveBeenCalledWith('/doc-types/doc-1', {
      signal: undefined,
    })
    expect(apiClient.post).toHaveBeenCalledWith('/doc-types', form)
    expect(apiClient.patch).toHaveBeenCalledWith('/doc-types/doc-1', form)
    expect(apiClient.patch).toHaveBeenCalledWith('/doc-types/doc-1', {
      dataJsonSchema: '{"type":"object"}',
      id: 'doc-1',
    })
    expect(apiClient.patch).toHaveBeenCalledWith('/doc-types/doc-1', {
      dataSubmissionExample: '{"ok":true}',
      id: 'doc-1',
    })
    expect(apiClient.delete).toHaveBeenCalledWith('/doc-types/doc-1')
    expect(apiClient.put).toHaveBeenCalledWith(
      '/doc-types/soft-delete',
      ['doc-1'],
      { params: { thruDate: '2026-01-01' } }
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/doc-types/bulk-delete', {
      data: ['doc-1'],
    })
  })
})
