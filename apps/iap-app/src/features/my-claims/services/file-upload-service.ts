import { getApiClient } from '@iap/api-client'
import { attachmentSchema, type Attachment } from '@iap/api-types'
export async function uploadClaimAttachment(file: File, onProgress?: (value: number) => void): Promise<Attachment> {
 const data = new FormData(); data.append('file', file)
 const response = await getApiClient().post<unknown>('/files/upload', data, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: event => { if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100)) } })
 return attachmentSchema.parse(response.data)
}
