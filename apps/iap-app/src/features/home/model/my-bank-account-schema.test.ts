import { describe, expect, it } from 'vitest'

import {
  calculateMod97,
  getIranianIbanBankCode,
  getIranianIbanBankName,
  isTemporarilyIgnoreIranianIban,
  isValidIranianIban,
  myBankAccountFormSchema,
} from './my-bank-account-schema'

describe('my-bank-account-schema', () => {
  it('calculates mod97 correctly', () => {
    expect(calculateMod97('182700000000000000000000')).toBe(93)
  })

  it('extracts bank code and bank name from IBAN digits', () => {
    // Bank Mellat code is '012'
    const ibanNumber = '820120000000000000000000'
    expect(getIranianIbanBankCode(ibanNumber)).toBe('012')
    expect(getIranianIbanBankName(ibanNumber)).toBe('بانک ملت')
  })

  it('identifies temporarily ignored bank codes', () => {
    // 062 is Bank Ayandeh
    expect(isTemporarilyIgnoreIranianIban('820620000000000000000000')).toBe(
      true
    )
    // 012 is Bank Mellat (not ignored)
    expect(isTemporarilyIgnoreIranianIban('820120000000000000000000')).toBe(
      false
    )
  })

  it('validates Iranian IBAN format and checksum', () => {
    // Invalid length
    expect(isValidIranianIban('123')).toBe(false)
    expect(isValidIranianIban('1234567890123456789012345')).toBe(false)

    // Valid format but invalid checksum
    expect(isValidIranianIban('111111111111111111111111')).toBe(false)
  })

  it('validates form schema with translations', () => {
    const t = (key: string) => key
    const schema = myBankAccountFormSchema(t)

    // Empty value
    const emptyResult = schema.safeParse({
      bankAccountNumber: '',
      bankAccountType: 'IBAN',
    })
    expect(emptyResult.success).toBe(false)

    // Non-digit
    const nonDigitResult = schema.safeParse({
      bankAccountNumber: 'abcdefghij12345678901234',
      bankAccountType: 'IBAN',
    })
    expect(nonDigitResult.success).toBe(false)
  })
})
