import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const themeCss = await readFile(
  new URL('../src/theme.css', import.meta.url),
  'utf8'
)

const parseTheme = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = themeCss.match(
    new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm')
  )

  assert.ok(match, `Missing ${selector} theme block`)

  return Object.fromEntries(
    [...match[1].matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(
      ([, name, value]) => [name, value.trim()]
    )
  )
}

const parseRgb = (value) => value.split(',').map((channel) => Number(channel))

const relativeLuminance = (channels) => {
  const linear = channels.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

const contrast = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(parseRgb(foreground))
  const backgroundLuminance = relativeLuminance(parseRgb(background))
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

const requiredTokens = [
  'background',
  'foreground',
  'surface',
  'surface-muted',
  'surface-elevated',
  'text-secondary',
  'border',
  'input',
  'ring',
  'primary',
  'primary-hover',
  'primary-subtle',
  'primary-foreground',
  'accent',
  'accent-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'destructive',
  'destructive-foreground',
  'info',
  'info-foreground',
]

test('light and dark themes expose the same semantic color contract', () => {
  const light = parseTheme(':root,\n.light')
  const dark = parseTheme('.dark')

  for (const token of requiredTokens) {
    assert.match(light[token], /^\d{1,3}, \d{1,3}, \d{1,3}$/)
    assert.match(dark[token], /^\d{1,3}, \d{1,3}, \d{1,3}$/)
  }
})

test('body text and primary actions meet WCAG AA in both themes', () => {
  const themes = [parseTheme(':root,\n.light'), parseTheme('.dark')]

  for (const theme of themes) {
    assert.ok(contrast(theme.foreground, theme.background) >= 4.5)
    assert.ok(contrast(theme['text-secondary'], theme.background) >= 4.5)
    assert.ok(contrast(theme['primary-foreground'], theme.primary) >= 4.5)
  }
})

test('default borders maintain at least 3:1 contrast against surfaces', () => {
  const themes = [parseTheme(':root,\n.light'), parseTheme('.dark')]

  for (const theme of themes) {
    assert.ok(contrast(theme.border, theme.surface) >= 3)
  }
})

test('the light application background is subtly distinct from white surfaces', () => {
  const light = parseTheme(':root,\n.light')

  assert.ok(contrast(light.background, light.surface) >= 1.1)
})
