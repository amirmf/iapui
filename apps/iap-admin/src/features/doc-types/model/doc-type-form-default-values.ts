import type { AdminDocType } from '@iap/api-types'
import { docTypeFormSchema } from '@iap/api-types'
import type { z } from 'zod'

export type DocTypeFormInput = z.input<typeof docTypeFormSchema>

export function createDocTypeFormDefaultValues(
  docType?: AdminDocType
): DocTypeFormInput {
  return {
    ceilingControlDamageCode: docType?.ceilingControlDamageCode ?? '',
    ceilingControlErrorDescription:
      docType?.ceilingControlErrorDescription ?? '',
    dataJsonSchema: docType?.dataJsonSchema ?? '{}',
    docType: docType?.docType ?? '',
    docTypeCode: docType?.docTypeCode ?? '',
    documentGuide: docType?.documentGuide ?? '',
    maxThreshold: docType?.maxThreshold ?? undefined,
    maxThresholdCountItem: docType?.maxThresholdCountItem ?? undefined,
    maxThresholdItem: docType?.maxThresholdItem ?? undefined,
    minThreshold: docType?.minThreshold ?? undefined,
    noCoverageErrorDescription: docType?.noCoverageErrorDescription ?? '',
    prompt: docType?.prompt ?? '',
    sequence: docType?.sequence ?? undefined,
  }
}
