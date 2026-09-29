import { createDocTypeFormDefaultValues } from '@features/doc-types/model/doc-type-form-default-values'
import { adminDocTypeSchema } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('createDocTypeFormDefaultValues', () => {
  it('keeps every reference form field stable for create and edit resets', () => {
    expect(createDocTypeFormDefaultValues()).toEqual({
      ceilingControlDamageCode: '',
      ceilingControlErrorDescription: '',
      dataJsonSchema: '{}',
      docType: '',
      docTypeCode: '',
      documentGuide: '',
      maxThreshold: undefined,
      maxThresholdCountItem: undefined,
      maxThresholdItem: undefined,
      minThreshold: undefined,
      noCoverageErrorDescription: '',
      prompt: '',
      sequence: undefined,
    })

    expect(
      createDocTypeFormDefaultValues(
        adminDocTypeSchema.parse({
          dataJsonSchema: '{"type":"object"}',
          docType: 'Invoice',
          docTypeCode: 'INV',
          maxThreshold: 10,
          prompt: 'Extract invoice data',
          sequence: 2,
        })
      )
    ).toMatchObject({
      dataJsonSchema: '{"type":"object"}',
      docType: 'Invoice',
      docTypeCode: 'INV',
      maxThreshold: 10,
      prompt: 'Extract invoice data',
      sequence: 2,
    })
  })
})
