import * as constants from '@features/claim-requests/model/claim-request-status'
import { claimRequestManagementQueryOptions } from '@features/claim-requests/queries/use-claim-request-management-data'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import fa from '@shared/i18n/locales/fa/common.json'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'

const root =
  process.env.INSURANCE_UI_REFERENCE_PATH ??
  '/home/sadegh/Android/project/insurance-ui'
const get = (object: unknown, key: string): unknown =>
  key
    .split('.')
    .reduce(
      (value: unknown, segment) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      object
    )

describe('management reference evidence', () => {
  it('preserves every mounted literal Persian value and source fallbacks', () => {
    const reference = JSON.parse(
      fs.readFileSync(path.join(root, 'src/locales/fa.json'), 'utf8')
    )
    const evidence = JSON.parse(
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          '../../docs/tasks/claim-request-management/reference-closure.json'
        ),
        'utf8'
      )
    ) as { keys: string[]; sourceAbsentKeys: string[] }
    for (const key of evidence.keys) {
      if (evidence.sourceAbsentKeys.includes(key)) continue
      expect(get(fa, key), key).toEqual(get(reference, key))
    }
    expect(get(reference, 'claimRequests.actions.view')).toBeUndefined()
    expect(get(reference, 'claimRequests.validation.aiStatus')).toBeUndefined()
  })

  it('preserves all management enum translation and color maps', () => {
    const source = fs.readFileSync(
      path.join(root, 'src/constants/claim-status-constant.ts'),
      'utf8'
    )
    const names = [
      'CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS',
      'CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS',
      'CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS',
      'CLAIM_REQUEST_OBJECTION_ROLE_TYPE_TRANSLATION_KEYS',
      'AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_TRANSLATION_KEYS',
      'AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_BADGE_COLORS',
      'AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_CARD_COLORS',
      'AI_ASSESSMENT_RESULT_ASSESS_TYPE_TRANSLATION_KEYS',
      'AI_ASSESSMENT_RESULT_ASSESS_TYPE_BADGE_COLORS',
      'DUPLICATE_VALIDATOR_TYPE_TRANSLATION_KEYS',
    ] as const
    for (const name of names) {
      const block = source.match(
        new RegExp(`export const ${name}\\b[\\s\\S]+?= \\{([\\s\\S]+?)\\n\\}`)
      )?.[1]
      expect(block, name).toBeDefined()
      const reference = Object.fromEntries(
        [...block!.matchAll(/([A-Z_]+):\s*'([^']+)'/g)].map(
          ([, key, value]) => [key, value]
        )
      )
      expect(constants[name], name).toEqual(reference)
    }
  })

  it('retains query identity, lifetimes, focus behavior and cancellation', async () => {
    const data = { id: 'claim-1' }
    const service = vi
      .spyOn(claimRequestService, 'getById')
      .mockResolvedValue(data)
    const signal = new AbortController().signal
    const options = claimRequestManagementQueryOptions('claim-1')
    expect(options.queryKey).toEqual(['claimRequest', 'claim-1'])
    expect(options.staleTime).toBe(10000)
    expect(options.gcTime).toBe(10000)
    expect(options.refetchOnWindowFocus).toBe(true)
    await (
      options.queryFn as (context: { signal: AbortSignal }) => Promise<unknown>
    )({ signal })
    expect(service).toHaveBeenCalledWith('claim-1', { signal })
    service.mockRestore()
  })
})
