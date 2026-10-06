import type { AssessmentPromptForm } from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { assessmentPromptService } from './assessment-prompt-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))
vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const id = '550e8400-e29b-41d4-a716-446655440000'
const fromDate = new Date('2026-01-02T03:04:05Z')
const thruDate = new Date('2026-02-02T03:04:05Z')
const form: AssessmentPromptForm = {
  agreementId: id,
  docTypeCode: 'DOC',
  fromDate,
  inputParams: null,
  methodNames: 'calculate',
  placeType: null,
  prompt: 'Prompt',
  ruleState: 'CALCULATION',
  status: 'ACTIVE',
  thruDate,
  title: 'Title',
}
const body = {
  ...form,
  fromDate: fromDate.toISOString(),
  thruDate: thruDate.toISOString(),
}

describe('assessmentPromptService', () => {
  beforeEach(() => vi.resetAllMocks())

  it('forwards cancellation and serialized multi-value filters to page-full', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [{ id }] } })
    const signal = new AbortController().signal

    await expect(
      assessmentPromptService.getPage({
        filters: {
          status: ['ACTIVE', 'PENDING'],
          'agreement.title': 'Agreement',
          sort: 'title',
          direction: 'desc',
        },
        page: 2,
        size: 10,
        signal,
      })
    ).resolves.toMatchObject({ content: [{ id }] })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/assessment-prompts/page-full',
      {
        params: {
          page: 2,
          size: 10,
          status__in: 'ACTIVE,PENDING',
          'agreement.title': 'Agreement',
          sort: 'title',
          direction: 'desc',
        },
        signal,
      }
    )
  })

  it('uses the reference page defaults', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    await assessmentPromptService.getPage({ filters: {} })
    expect(apiClient.get).toHaveBeenCalledWith(
      '/assessment-prompts/page-full',
      {
        params: { page: 0, size: 30 },
        signal: undefined,
      }
    )
  })

  it('forwards cancellation to the detail endpoint', async () => {
    apiClient.get.mockResolvedValue({ data: { id } })
    const signal = new AbortController().signal
    await expect(
      assessmentPromptService.getById(id, { signal })
    ).resolves.toEqual({
      id,
    })
    expect(apiClient.get).toHaveBeenCalledWith(`/assessment-prompts/${id}`, {
      signal,
    })
  })

  it('posts a validated form with ISO dates', async () => {
    apiClient.post.mockResolvedValue({ data: { id } })
    await expect(assessmentPromptService.create(form)).resolves.toEqual({ id })
    expect(apiClient.post).toHaveBeenCalledWith('/assessment-prompts', body)
  })

  it('puts a validated form to the entity path', async () => {
    apiClient.put.mockResolvedValue({ data: { id } })
    await assessmentPromptService.update(id, form)
    expect(apiClient.put).toHaveBeenCalledWith(
      `/assessment-prompts/${id}`,
      body
    )
  })

  it('omits the optional thruDate when serializing a form', async () => {
    apiClient.post.mockResolvedValue({ data: { id } })
    await assessmentPromptService.create({ ...form, thruDate: undefined })
    expect(apiClient.post.mock.calls[0]?.[1]).toMatchObject({
      fromDate: fromDate.toISOString(),
      thruDate: undefined,
    })
  })

  it('permanently deletes one entity and validates an empty response', async () => {
    apiClient.delete.mockResolvedValue({ data: '' })
    await expect(assessmentPromptService.delete(id)).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith(`/assessment-prompts/${id}`)
  })

  it('puts soft-delete expiry in the query with no body', async () => {
    apiClient.put.mockResolvedValue({ data: { id } })
    await assessmentPromptService.softDelete(id, thruDate.toISOString())
    expect(apiClient.put).toHaveBeenCalledWith(
      `/assessment-prompts/soft-delete/${id}`,
      undefined,
      {
        params: { thruDate: thruDate.toISOString() },
      }
    )
  })

  it('puts bulk soft-delete IDs in the body and expiry in the query', async () => {
    apiClient.put.mockResolvedValue({ data: [{ id }] })
    await expect(assessmentPromptService.softDeleteBulk([id])).resolves.toEqual(
      [{ id }]
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/assessment-prompts/soft-delete',
      [id],
      { params: { thruDate: undefined } }
    )
  })

  it('puts bulk permanent-delete IDs in the DELETE body', async () => {
    apiClient.delete.mockResolvedValue({ data: undefined })
    await expect(
      assessmentPromptService.bulkDelete([id])
    ).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/assessment-prompts/bulk-delete',
      { data: [id] }
    )
  })

  it('rejects invalid UUIDs and pagination before dispatching any request', async () => {
    await expect(assessmentPromptService.getById('invalid')).rejects.toThrow()
    await expect(assessmentPromptService.delete('invalid')).rejects.toThrow()
    await expect(
      assessmentPromptService.update('invalid', form)
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.softDelete('invalid')
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.softDeleteBulk(['invalid'])
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.bulkDelete(['invalid'])
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.getPage({ filters: {}, page: 1.5 })
    ).rejects.toThrow()
    Object.values(apiClient).forEach((method) =>
      expect(method).not.toHaveBeenCalled()
    )
  })

  it('validates required form fields and dates before ISO serialization or dispatch', async () => {
    await expect(
      assessmentPromptService.create({ ...form, title: '' })
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.update(id, { ...form, prompt: '' })
    ).rejects.toThrow()
    await expect(
      assessmentPromptService.create({ ...form, fromDate: new Date('invalid') })
    ).rejects.toThrow()
    expect(apiClient.post).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
  })

  it('rejects malformed responses for every response shape', async () => {
    apiClient.get.mockResolvedValue({
      data: { content: [{ status: 'INVALID' }] },
    })
    await expect(
      assessmentPromptService.getPage({ filters: {} })
    ).rejects.toThrow()
    apiClient.get.mockResolvedValue({ data: { id: 'invalid' } })
    await expect(assessmentPromptService.getById(id)).rejects.toThrow()
    apiClient.post.mockResolvedValue({ data: { ruleState: 'INVALID' } })
    await expect(assessmentPromptService.create(form)).rejects.toThrow()
    apiClient.put.mockResolvedValue({ data: { placeType: 'INVALID' } })
    await expect(assessmentPromptService.update(id, form)).rejects.toThrow()
    await expect(assessmentPromptService.softDelete(id)).rejects.toThrow()
    apiClient.put.mockResolvedValue({ data: [{ id: 'invalid' }] })
    await expect(assessmentPromptService.softDeleteBulk([id])).rejects.toThrow()
    apiClient.delete.mockResolvedValue({ data: { deleted: true } })
    await expect(assessmentPromptService.delete(id)).rejects.toThrow()
    await expect(assessmentPromptService.bulkDelete([id])).rejects.toThrow()
  })
})
