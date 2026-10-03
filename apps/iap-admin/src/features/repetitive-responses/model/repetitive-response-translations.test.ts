import fa from '@shared/i18n/locales/fa/common.json'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

type RepetitiveResponseTranslations = {
  repetitiveResponses: unknown
  repetitiveResponseGroups: unknown
}

function getReferenceTranslations(): RepetitiveResponseTranslations {
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
  ) as RepetitiveResponseTranslations
}

describe('RepetitiveResponsesPage Persian translations', () => {
  it('copies the complete mounted source namespaces verbatim', () => {
    const reference = getReferenceTranslations()
    const target = fa as RepetitiveResponseTranslations

    expect(target.repetitiveResponses).toEqual(reference.repetitiveResponses)
    expect(target.repetitiveResponseGroups).toEqual(
      reference.repetitiveResponseGroups
    )
  })
})
