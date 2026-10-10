import { z } from 'zod'

export const myBankAccountTypeSchema = z.enum(['IBAN', 'CARD'])
const banks: Record<string, string> = {
  '010': 'بانک مرکزی',
  '011': 'بانک صنعت و معدن',
  '012': 'بانک ملت',
  '013': 'بانک رفاه کارگران',
  '014': 'بانک مسکن',
  '015': 'بانک سپه',
  '016': 'بانک کشاورزی',
  '017': 'بانک ملی ایران',
  '018': 'بانک تجارت',
  '019': 'بانک صادرات ایران',
  '020': 'بانک توسعه صادرات ایران',
  '021': 'پست بانک ایران',
  '022': 'بانک توسعه تعاون',
  '051': 'موسسه اعتباری توسعه',
  '052': 'بانک قوامین',
  '053': 'بانک کارآفرین',
  '054': 'بانک پارسیان',
  '055': 'بانک اقتصاد نوین',
  '056': 'بانک سامان',
  '057': 'بانک پاسارگاد',
  '058': 'بانک سرمایه',
  '059': 'بانک سینا',
  '060': 'بانک قرض الحسنه مهر ایران',
  '061': 'بانک شهر',
  '062': 'بانک آینده',
  '063': 'بانک انصار',
  '064': 'بانک گردشگری',
  '065': 'بانک حکمت ایرانیان',
  '066': 'بانک دی',
  '069': 'بانک ایران زمین',
  '070': 'بانک قرض الحسنه رسالت',
  '073': 'بانک خاورمیانه',
  '075': 'موسسه اعتباری ملل',
  '078': 'بانک مهر اقتصاد',
  '080': 'بانک نور',
  '090': 'بانک مهر ایران',
  '095': 'بانک ایران و ونزوئلا',
}
const ignored = ['062', '065', '079', '073', '052', '063']
const mod97 = (value: string) => {
  let remainder = 0
  for (const char of value) remainder = (remainder * 10 + Number(char)) % 97
  return remainder
}
export const isValidIranianIban = (value: string) => {
  const iban = `IR${value}`
  if (!/^IR\d{24}$/.test(iban)) return false
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
  const numeric = rearranged.replace(/[A-Z]/g, (char) =>
    String(char.charCodeAt(0) - 55)
  )
  return mod97(numeric) === 1
}
export const getIranianIbanBankCode = (value: string) =>
  `IR${value}`.substring(4, 7)
export const getIranianIbanBankName = (value: string) =>
  banks[getIranianIbanBankCode(value)]
export const myBankAccountFormSchema = (t: (key: string) => string) =>
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
          isValidIranianIban(value) &&
          !ignored.includes(getIranianIbanBankCode(value)),
        { message: t('myiap.myBankAccount.messages.temporaryIbanError') }
      ),
    bankAccountType: myBankAccountTypeSchema,
  })
export const myBankAccountRequestSchema = z
  .object({
    bankAccountNumber: z.string(),
    bankAccountType: myBankAccountTypeSchema,
  })
  .strict()
export const myBankAccountResponseSchema = z
  .object({
    id: z.string().optional().nullable(),
    bankAccountNumber: z.string().optional().nullable(),
    bankAccountType: myBankAccountTypeSchema.optional(),
  })
  .loose()
export type MyBankAccountRequest = z.infer<typeof myBankAccountRequestSchema>
