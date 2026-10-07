import {
  CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS,
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  getClaimRequestAiStatusOptions,
  getClaimRequestRequestTypeOptions,
  getClaimRequestStatusOptions,
} from '@features/claim-requests/model/claim-request-status'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('reference claim enum option order and keys', () => {
  it('preserves source order and all canonical map entries', () => {
    const root =
      process.env.INSURANCE_UI_REFERENCE_PATH ??
      path.resolve(process.cwd(), '../../../insurance-ui')
    const source = fs.readFileSync(
      path.join(root, 'src/constants/claim-status-constant.ts'),
      'utf8'
    )
    for (const [name, map] of Object.entries({
      CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
      CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS,
    })) {
      const body = source.match(
        new RegExp(
          'export const ' + name + ':[\\s\\S]*?= (\\{[\\s\\S]*?\\n\\})'
        )
      )?.[1]
      expect(body).toBeDefined()
      const entries = [...body!.matchAll(/([A-Z_]+):\s*'([^']+)'/g)].map(
        (match) => [match[1], match[2]]
      )
      expect(Object.entries(map)).toEqual(entries)
    }
    expect(
      getClaimRequestStatusOptions((key) => key).map((option) => option.value)
    ).toEqual(Object.keys(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS))
    expect(
      getClaimRequestAiStatusOptions((key) => key).map((option) => option.value)
    ).toEqual(Object.keys(CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS))
    expect(
      getClaimRequestRequestTypeOptions((key) => key).map(
        (option) => option.value
      )
    ).toEqual(['MAIN', 'ADJUSTMENT'])
  })
})
