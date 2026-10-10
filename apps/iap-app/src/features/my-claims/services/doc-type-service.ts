import { getApiClient } from '@iap/api-client'
import { docTypePageSchema, type PageDocType } from '@iap/api-types'
export const docTypeService = { getPage: async (signal?: AbortSignal): Promise<PageDocType> => { const response = await getApiClient().get<unknown>('/doc-types/page', { params: { page: 0, size: 100 }, signal }); return docTypePageSchema.parse(response.data) } }
