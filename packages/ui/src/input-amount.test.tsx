import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { InputAmount } from './input-amount'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.rial': 'ریال',
        'common.toman': 'تومان',
      }
      return translations[key] ?? key
    },
  }),
}))

describe('InputAmount', () => {
  it('renders input with rial unit badge and converts to Persian words in toman', () => {
    render(<InputAmount value='1000000' readOnly />)

    expect(screen.getByText('ریال')).toBeDefined()
    expect(screen.getByText(/صد هزار/)).toBeDefined()
    expect(screen.getByText(/تومان/)).toBeDefined()
  })

  it('renders empty when value is empty', () => {
    const { container } = render(<InputAmount value='' readOnly />)
    expect(container.querySelector('input')).toBeDefined()
    expect(screen.getByText('ریال')).toBeDefined()
  })
})
