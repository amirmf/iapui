import { getApiClient } from '@iap/api-client'
import {
  type DocTypeForm,
  type DocTypeInlineForm,
  adminDocTypeSchema,
  bulkDeleteDocTypesRequestSchema,
  createDocTypeRequestSchema,
  deleteDocTypeRequestSchema,
  docTypePageRequestSchema,
  docTypePageSchema,
  getDocTypeRequestSchema,
  softDeleteDocTypesRequestSchema,
  updateDocTypeInlineRequestSchema,
  updateDocTypeRequestSchema,
  updateDocTypeSchemaRequestSchema,
  updateDocTypeSubmissionExampleRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const docTypeService = {
  async bulkDelete(ids: string[]) {
    const request = bulkDeleteDocTypesRequestSchema.parse(ids)
    await getApiClient().delete('/doc-types/bulk-delete', { data: request })
  },
  async create(input: DocTypeForm) {
    const request = createDocTypeRequestSchema.parse(input)
    const response = await getApiClient().post('/doc-types', request)
    return adminDocTypeSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteDocTypeRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`/doc-types/${request.path.id}`)
  },
  async getById(id: string, signal?: AbortSignal) {
    const request = getDocTypeRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(`/doc-types/${request.path.id}`, {
      signal,
    })
    return adminDocTypeSchema.parse(response.data)
  },
  async getPage(input: {
    filters?: Record<string, string | number | string[]>
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = docTypePageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get('/doc-types/page', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return docTypePageSchema.parse(response.data)
  },
  async softDelete(ids: string[], thruDate?: string) {
    const request = softDeleteDocTypesRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/doc-types/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return adminDocTypeSchema.array().parse(response.data)
  },
  async update(id: string, input: DocTypeForm) {
    const request = updateDocTypeRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/doc-types/${request.path.id}`,
      request.body
    )
    return adminDocTypeSchema.parse(response.data)
  },
  async updateInline(id: string, input: DocTypeInlineForm) {
    const request = updateDocTypeInlineRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/doc-types/${request.path.id}`,
      request.body
    )
    return adminDocTypeSchema.parse(response.data)
  },
  async updateSchema(id: string, schema: string) {
    const request = updateDocTypeSchemaRequestSchema.parse({
      body: { dataJsonSchema: schema, id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/doc-types/${request.path.id}`,
      request.body
    )
    return adminDocTypeSchema.parse(response.data)
  },
  async updateSubmissionExample(id: string, submission: string) {
    const request = updateDocTypeSubmissionExampleRequestSchema.parse({
      body: { dataSubmissionExample: submission, id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/doc-types/${request.path.id}`,
      request.body
    )
    return adminDocTypeSchema.parse(response.data)
  },
}
