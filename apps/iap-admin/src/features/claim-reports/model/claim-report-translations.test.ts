import fa from '@shared/i18n/locales/fa/common.json'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('ClaimReportsPage Persian translations', () => {
  it('copies the mounted reference translation closure verbatim', () => {
    const referencePath = path.resolve(
      process.env.INSURANCE_UI_REFERENCE_PATH ??
        path.join(process.cwd(), '../../..', 'insurance-ui'),
      'src/locales/fa.json'
    )

    expect(
      fs.existsSync(referencePath),
      `Missing reference locale at ${referencePath}. Set INSURANCE_UI_REFERENCE_PATH to the insurance-ui repository root.`
    ).toBe(true)

    const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8')) as {
      claimReports: unknown
      outpatientDocAcceptances: { status: unknown; wsStatus: unknown }
    }

    expect(fa.claimReports).toEqual(reference.claimReports)
    expect(fa.outpatientDocAcceptances.status).toEqual(
      reference.outpatientDocAcceptances.status
    )
    expect(fa.outpatientDocAcceptances.wsStatus).toEqual(
      reference.outpatientDocAcceptances.wsStatus
    )
  })
})
