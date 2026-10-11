import common from '@shared/i18n/locales/fa/common.json'
import { describe, expect, it } from 'vitest'

import fixture from './reference-translations.fixture.json'

describe('agent detail reference translations', () => {
  it('preserves every mounted source translation value', () => {
    for (const [key, value] of Object.entries(fixture)) {
      let actual: unknown = common
      for (const part of key.split('.'))
        actual = (actual as Record<string, unknown>)[part]
      expect(actual, key).toBe(value)
    }
  })
})
