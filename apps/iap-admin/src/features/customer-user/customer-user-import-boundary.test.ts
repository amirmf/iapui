import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const featureRoot = join(__dirname, '..')

function getSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return []
  }
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? getSourceFiles(path) : [path]
  })
}

function hasCrossFeatureImport(sourceDirectory: string, targetFeature: string) {
  return getSourceFiles(sourceDirectory)
    .filter((file) => /\.(ts|tsx)$/.test(file) && !file.includes('.test.'))
    .some((file) => {
      const source = readFileSync(file, 'utf8')
      const importSpecifiers = [
        ...source.matchAll(/from\s*['"]([^'"]+)['"]/g),
      ].map((match) => match[1])

      return importSpecifiers.some(
        (specifier) =>
          specifier.includes(`@features/${targetFeature}`) ||
          specifier.includes(`features/${targetFeature}`) ||
          specifier.includes(targetFeature)
      )
    })
}

describe('Customer User and Agent feature boundaries', () => {
  it('contains no imports in either direction between customer-user and agent-claim-requests', () => {
    expect(
      hasCrossFeatureImport(
        join(featureRoot, 'customer-user'),
        'agent-claim-requests'
      )
    ).toBe(false)
    expect(
      hasCrossFeatureImport(
        join(featureRoot, 'agent-claim-requests'),
        'customer-user'
      )
    ).toBe(false)
  })

  it('verifies customer-user claim request management page does not import agent-claim-requests directly', () => {
    const managementPagePath = join(
      featureRoot,
      'customer-user/pages/customer-user-claim-request-management-page.tsx'
    )
    const source = readFileSync(managementPagePath, 'utf8')
    expect(source).not.toContain('@features/agent-claim-requests')
    expect(source).not.toContain('features/agent-claim-requests')
  })
})
