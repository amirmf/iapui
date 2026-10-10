import {
  type AddMyBankAccountRequest,
  type BankAccount,
  bankAccountSchema,
  bankAccountTypeSchema,
} from '@iap/api-types'
import { z } from 'zod'

import {
  iranianIbanBanks,
  temporarilyIgnoreIbanBankCodes,
} from '../constants/bank-account-constant'

export const calculateMod97 = (value: string): number => {
  let remainder = 0
  for (const char of value) {
    remainder = (remainder * 10 + Number(char)) % 97
  }
  return remainder
}

export const normalizeIranianIban = (value: string): string => `IR${value}`

export const getIranianIbanBankCode = (value: string): string =>
  normalizeIranianIban(value).substring(4, 7)

export const getIranianIbanBankName = (value: string): string | undefined =>
  iranianIbanBanks[getIranianIbanBankCode(value)]

export const isValidIranianIban = (value: string): boolean => {
  const iban = normalizeIranianIban(value)

  if (!/^IR\d{24}$/.test(iban)) {
    return false
  }

  const rearrangedIban = `${iban.slice(4)}${iban.slice(0, 4)}`
  const numericIban = rearrangedIban.replace(/[A-Z]/g, (char) =>
    String(char.charCodeAt(0) - 55)
  )

  return calculateMod97(numericIban) === 1
}

export const isTemporarilyIgnoreIranianIban = (value: string): boolean =>
  temporarilyIgnoreIbanBankCodes.includes(getIranianIbanBankCode(value))

export type MyBankAccountTranslationKey =
  | 'myiap.myBankAccount.messages.numberRequired'
  | 'myiap.myBankAccount.messages.numberError'
  | 'myiap.myBankAccount.messages.temporaryIbanError'

export const myBankAccountFormSchema = (
  t: (key: MyBankAccountTranslationKey) => string
) =>
  z.object({
    bankAccountNumber: z
      .string()
      .min(1, t('myiap.myBankAccount.messages.numberRequired'))
      .length(24, t('myiap.myBankAccount.messages.numberError'))
      .regex(/^\d+$/, t('myiap.myBankAccount.messages.numberError'))
      .refine(isValidIranianIban, {
        message: t('myiap.myBankAccount.messages.numberError'),
      })
      .refine(
        (value) =>
          isValidIranianIban(value) && !isTemporarilyIgnoreIranianIban(value),
        {
          message: t('myiap.myBankAccount.messages.temporaryIbanError'),
        }
      ),
    bankAccountType: bankAccountTypeSchema,
  })

export const userAccountBankAccountNumberSchema = bankAccountSchema

export type { AddMyBankAccountRequest, BankAccount }
export type UserAccountBankAccountNumber = BankAccount
