import type { PreAuth } from '@iap/api-types'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { formatAmount } from '../utils/format-amount'
import { PreAuthCard } from './pre-auth-card'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'myiap.preAuths.fields.amount': 'مبلغ',
        'myiap.preAuths.fields.description': 'توضیحات',
        'myiap.preAuths.fields.franchise': 'فرانشیز',
        'myiap.preAuths.fields.issueDate': 'تاریخ ثبت',
        'myiap.preAuths.fields.receptionDate': 'تاریخ پذیرش',
        'myiap.preAuths.fields.validityBeginDate': 'تاریخ شروع اعتبار',
        'myiap.preAuths.fields.validityEndDate': 'تاریخ پایان اعتبار',
        'myiap.preAuths.status.approved': 'تایید شده',
        'myiap.preAuths.status.cancelled': 'ابطالی',
        'myiap.preAuths.status.draft': 'پیش نویس',
      }
      return translations[key] ?? key
    },
  }),
}))

const mockPreAuth: PreAuth = {
  amount: 2500000,
  desc: 'تاییدیه خدمات درمانی',
  franchise: 500000,
  id: 42,
  illnessDesc: 'خدمات دندانپزشکی',
  illnessId: 104,
  issuDate: '1403/06/15',
  preAuthValidityBeginDate: '1403/06/15',
  preAuthValidityEndDate: '1403/07/15',
  receptionDate: '1403/06/20',
  status: 102,
}

describe('PreAuthCard', () => {
  it('renders pre-authorization card with illness details and formatted amounts', () => {
    render(<PreAuthCard preAuth={mockPreAuth} />)

    expect(screen.getByText('خدمات دندانپزشکی (104)')).toBeDefined()
    expect(screen.getByText('تایید شده')).toBeDefined()
    expect(screen.getByText('تاییدیه خدمات درمانی')).toBeDefined()
    expect(screen.getAllByText('1403/06/15').length).toBeGreaterThanOrEqual(1)
  })

  it('renders correct status label for draft (101) and cancelled (103)', () => {
    const { rerender } = render(
      <PreAuthCard preAuth={{ ...mockPreAuth, status: 101 }} />
    )
    expect(screen.getByText('پیش نویس')).toBeDefined()

    rerender(<PreAuthCard preAuth={{ ...mockPreAuth, status: 103 }} />)
    expect(screen.getByText('ابطالی')).toBeDefined()
  })

  it('formats numeric amounts with comma separation', () => {
    expect(formatAmount(1000000)).toMatch(/1[,\u066c]000[,\u066c]000/)
    expect(formatAmount(0)).toBe('0')
    expect(formatAmount(null)).toBeNull()
    expect(formatAmount(undefined)).toBeNull()
  })
})
