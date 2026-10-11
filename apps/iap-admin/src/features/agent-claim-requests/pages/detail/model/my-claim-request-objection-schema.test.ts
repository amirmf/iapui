import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

import { myClaimRequestObjectionFormSchema } from './my-claim-request-objection-schema'

const t = ((key: string) => key) as TFunction
const schema = myClaimRequestObjectionFormSchema(t)
const attachment = {
  filename: 'evidence.pdf',
  fileType: 'pdf',
  fileSize: 12,
  uploadDate: '2026-10-11',
  minioObjectName: 'evidence',
  bucketName: 'claims',
  custom: 'retained',
  id: null,
  metadata: null,
}

describe('myClaimRequestObjectionFormSchema reference contract', () => {
  it('retains complete ordered source issues for simultaneous empty fields', () => {
    const result = schema.safeParse({ formDescription: '  ', attachments: [] })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues).toEqual([
      {
        origin: 'string',
        code: 'too_small',
        minimum: 1,
        inclusive: true,
        path: ['formDescription'],
        message: 'myiap.claimRequest.messages.descriptionRequired',
      },
      {
        origin: 'array',
        code: 'too_small',
        minimum: 1,
        inclusive: true,
        path: ['attachments'],
        message: 'myiap.claimRequest.messages.attachmentsRequired',
      },
    ])
  })
  it('trims descriptions, strips form extras, and retains loose attachment metadata', () => {
    expect(
      schema.parse({
        formDescription: '  reason  ',
        attachments: [attachment],
        extra: 'stripped',
      })
    ).toEqual({ formDescription: 'reason', attachments: [attachment] })
  })
  it('keeps all missing attachment metadata issue paths in declaration order', () => {
    const result = schema.safeParse({
      formDescription: 'reason',
      attachments: [{}],
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(
      result.error.issues.map((issue) => ({
        path: issue.path,
        code: issue.code,
        expected: issue.code === 'invalid_type' ? issue.expected : undefined,
      }))
    ).toEqual(
      [
        ['filename', 'string'],
        ['fileType', 'string'],
        ['fileSize', 'number'],
        ['uploadDate', 'string'],
        ['minioObjectName', 'string'],
        ['bucketName', 'string'],
      ].map(([name, expected]) => ({
        path: ['attachments', 0, name],
        code: 'invalid_type',
        expected,
      }))
    )
  })
})
