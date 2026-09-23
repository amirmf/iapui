import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('resolves conflicting Tailwind utilities', () => {
    expect(cn('h-10 px-3', false && 'hidden', 'h-11')).toBe('px-3 h-11')
  })
})
