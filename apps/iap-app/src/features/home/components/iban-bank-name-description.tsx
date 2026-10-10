import { FormDescription } from '@iap/forms'

import {
  getIranianIbanBankName,
  isValidIranianIban,
} from '../model/my-bank-account-schema'

interface IbanBankNameDescriptionProps {
  bankAccountNumber: string
}

export function IbanBankNameDescription({
  bankAccountNumber,
}: IbanBankNameDescriptionProps) {
  const bankName = isValidIranianIban(bankAccountNumber)
    ? getIranianIbanBankName(bankAccountNumber)
    : undefined

  if (!bankName) {
    return null
  }

  return <FormDescription>{bankName}</FormDescription>
}
