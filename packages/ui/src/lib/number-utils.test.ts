import { describe, expect, it } from 'vitest'

import {
  arabicToEnglishDigits,
  numWithComma,
  numberToPersianWords,
  onlyNumberValue,
  persianToEnglishDigits,
} from './number-utils'

describe('number-utils', () => {
  it('converts Persian digits to English digits', () => {
    expect(persianToEnglishDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789')
  })

  it('converts Arabic digits to English digits', () => {
    expect(arabicToEnglishDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789')
  })

  it('formats numbers with commas', () => {
    expect(numWithComma('1000000')).toBe('1,000,000')
    expect(numWithComma(50000)).toBe('50,000')
    expect(numWithComma('')).toBe('')
  })

  it('extracts only number digits stripping formatting', () => {
    expect(onlyNumberValue('1,234,567')).toBe('1234567')
    expect(onlyNumberValue('۱۲,۳۴۵')).toBe('12345')
  })

  it('converts numbers to Persian words', () => {
    expect(numberToPersianWords(0)).toBe('صفر')
    expect(numberToPersianWords(15)).toBe('پانزده')
    expect(numberToPersianWords(1000)).toBe('یک هزار')
    expect(numberToPersianWords(1250000)).toBe('یک میلیون و دویست و پنجاه هزار')
  })
})
