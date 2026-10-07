import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const workspace = path.resolve(import.meta.dirname, '../../..')
const reference =
  process.env.INSURANCE_UI_REFERENCE_PATH ??
  path.resolve(workspace, '../insurance-ui')
const source = path.join(reference, 'src/features/support')
const target = import.meta.dirname

function files(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? files(fullPath) : [fullPath]
  })
}
function componentNames(file: string) {
  const syntax = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  )
  const names = new Set<string>()
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) &&
      node.name &&
      /^[A-Z]/.test(node.name.text)
    )
      names.add(node.name.text)
    ts.forEachChild(node, visit)
  }
  visit(syntax)
  return [...names].sort()
}
function leaf(resource: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (typeof current !== 'object' || current === null) return undefined
    return (current as Record<string, unknown>)[segment]
  }, resource)
}
function resource(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>
}
const sourceLocale = resource(path.join(reference, 'src/locales/fa.json'))
const sourceFiles = files(source).filter(
  (file) => /\.tsx?$/.test(file) && !file.includes('.test.')
)
const literalKeys = new Set(
  sourceFiles.flatMap((file) =>
    [
      ...fs.readFileSync(file, 'utf8').matchAll(/\bt\(\s*['"]([^'"]+)['"]/g),
    ].map((match) => match[1]!)
  )
)
const statusKeys = new Set(
  files(target)
    .filter((file) => /\.tsx?$/.test(file) && !file.includes('.test.'))
    .flatMap((file) =>
      [
        ...fs
          .readFileSync(file, 'utf8')
          .matchAll(/['"]((?:tickets|claimRequests)\.status\.[^'"]+)['"]/g),
      ].map((match) => match[1]!)
    )
)

describe('actual reference support names and Persian locale closure', () => {
  it('retains every declared public/private React component name in every reference component file', () => {
    for (const file of sourceFiles.filter((file) => file.endsWith('.tsx'))) {
      const relative = path.relative(source, file)
      const counterpart =
        relative === 'components/support-flow-provider.tsx'
          ? 'context/provider/support-flow-provider.tsx'
          : relative
      const targetFile = path.join(target, counterpart)
      expect(fs.existsSync(targetFile), counterpart).toBe(true)
      expect(componentNames(targetFile), counterpart).toEqual(
        componentNames(file)
      )
    }
  })
  it.each(['iap-admin', 'iap-app'])(
    'preserves source locale values and absent keys for %s',
    (application) => {
      const locale = resource(
        path.join(
          workspace,
          'apps',
          application,
          'src/shared/i18n/locales/fa/common.json'
        )
      )
      expect(locale.supportFlow).toEqual(sourceLocale.supportFlow)
      for (const key of [...literalKeys, ...statusKeys])
        expect(leaf(locale, key), key).toEqual(leaf(sourceLocale, key))
    }
  )
})
