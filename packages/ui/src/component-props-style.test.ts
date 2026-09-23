import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const sourceDirectory = dirname(fileURLToPath(import.meta.url))
const sourceFiles = readdirSync(sourceDirectory)
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .map((file) => join(sourceDirectory, file))

describe('component props convention', () => {
  it('destructures component props inside the function body', () => {
    const violations = sourceFiles.filter((file) =>
      /function\s+\w+\s*\(\s*\{/.test(readFileSync(file, 'utf8'))
    )

    expect(violations).toEqual([])
  })
})
