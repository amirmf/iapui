import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

type OtpTranslations = Record<string, unknown>

function readOtpTranslations(filePath: string) {
  return (
    JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
      otp: OtpTranslations
    }
  ).otp
}

describe('OTP Persian translations', () => {
  it('matches the mounted reference namespace verbatim', () => {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
    const targetPath = path.resolve(
      currentDirectory,
      '../../../shared/i18n/locales/fa/common.json'
    )
    const referenceRoot =
      process.env.INSURANCE_UI_REFERENCE_PATH ??
      path.resolve(currentDirectory, '../../../../../../../insurance-ui')
    const referencePath = path.join(referenceRoot, 'src/locales/fa.json')

    expect(
      fs.existsSync(referencePath),
      `Missing reference locale at ${referencePath}. Set INSURANCE_UI_REFERENCE_PATH to the insurance-ui repository root.`
    ).toBe(true)
    expect(readOtpTranslations(targetPath)).toEqual(
      readOtpTranslations(referencePath)
    )
  })
})
