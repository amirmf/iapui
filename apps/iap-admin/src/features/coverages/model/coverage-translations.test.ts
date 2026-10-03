import fa from '@shared/i18n/locales/fa/common.json'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

type CoverageTranslations = {
  coverageDamageCodeAppls: unknown
  coverages: unknown
}

function getReferenceTranslations(): CoverageTranslations {
  const referencePath = path.resolve(
    process.env.INSURANCE_UI_REFERENCE_PATH ??
      path.join(process.cwd(), '../../..', 'insurance-ui'),
    'src/locales/fa.json'
  )

  expect(
    fs.existsSync(referencePath),
    `Missing reference locale at ${referencePath}. Set INSURANCE_UI_REFERENCE_PATH to the insurance-ui repository root.`
  ).toBe(true)

  return JSON.parse(
    fs.readFileSync(referencePath, 'utf8')
  ) as CoverageTranslations
}

describe('CoveragesPage Persian translations', () => {
  it('copies the complete source namespaces verbatim without target-only keys', () => {
    const reference = getReferenceTranslations()

    expect(fa.coverages).toEqual(reference.coverages)
    expect(fa.coverageDamageCodeAppls).toEqual(
      reference.coverageDamageCodeAppls
    )
  })
})
