import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

test('semantic colors compile with Tailwind slash-opacity modifiers', () => {
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'tailwindcss',
      '--config',
      'tailwind.preset.ts',
      '--input',
      'tests/input.css',
      '--content',
      'tests/opacity.fixture.html',
      '--minify',
    ],
    { cwd: new URL('..', import.meta.url), encoding: 'utf8' }
  )

  assert.equal(result.status, 0, result.stderr)
  assert.match(
    result.stdout,
    /background-color:rgba\(var\(--color-primary\),\.5\)/
  )
  assert.match(
    result.stdout,
    /background-color:rgba\(var\(--color-primary-600\),\.3\)/
  )
  assert.match(result.stdout, /color:rgba\(var\(--color-foreground\),\.7\)/)
  assert.match(result.stdout, /border-color:rgba\(var\(--color-border\),\.6\)/)
  assert.match(
    result.stdout,
    /--tw-ring-color:rgba\(var\(--color-ring\),0?\.4\)/
  )
})
