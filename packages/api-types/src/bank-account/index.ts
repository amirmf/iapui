import { z } from 'zod'

import { createPageRequestSchema } from '../common'

export const bankAccountTypeSchema = z.enum(['IBAN', 'CARD'])
export const yesNoSchema = z.enum(['Y', 'N'])
export const bankAccountValiditySchema = yesNoSchema

export const bankAccountSchema = z
  .object({
    id: z.uuid().optional().nullable(),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    createdBy: z.string().optional().nullable(),
    updatedBy: z.string().optional().nullable(),
    userId: z.uuid(),
    bankAccountNumber: z.string(),
    phoneNumber: z.string().optional().nullable(),
    bankAccountType: bankAccountTypeSchema,
    isValid: yesNoSchema.optional().nullable(),
  })
  .loose()

export const userAccountBankAccountNumberSchema = bankAccountSchema

export const addMyBankAccountRequestSchema = z
  .object({
    bankAccountNumber: z.string().min(1),
    bankAccountType: bankAccountTypeSchema,
  })
  .strict()

const bankAccountIdPathSchema = z.object({ id: z.uuid() }).strict()

export const editMyBankAccountRequestSchema = z
  .object({
    path: bankAccountIdPathSchema,
    body: addMyBankAccountRequestSchema,
  })
  .strict()

export const bankAccountListSchema = z.array(bankAccountSchema)
export const pageBankAccountSchema = z.object({
  totalPages: z.number().optional(),
  totalElements: z.number().optional(),
  size: z.number().optional(),
  content: bankAccountListSchema.nullish(),
  number: z.number().optional(),
  first: z.boolean().optional(),
  last: z.boolean().optional(),
  numberOfElements: z.number().optional(),
  empty: z.boolean().optional(),
})
export const bankAccountPageSchema = pageBankAccountSchema
export const bankAccountPageRequestSchema = createPageRequestSchema()

export const deleteBankAccountRequestSchema = z
  .object({ path: bankAccountIdPathSchema })
  .strict()
export const bulkDeleteBankAccountsRequestSchema = z
  .object({ body: z.array(z.uuid()).min(1) })
  .strict()

export type BankAccount = z.infer<typeof bankAccountSchema>
export type UserAccountBankAccountNumber = BankAccount
export type BankAccountType = z.infer<typeof bankAccountTypeSchema>
export type AddMyBankAccountRequest = z.infer<
  typeof addMyBankAccountRequestSchema
>
export type EditMyBankAccountRequest = z.infer<
  typeof editMyBankAccountRequestSchema
>
export type PageBankAccount = z.infer<typeof pageBankAccountSchema>
export type BankAccountPage = PageBankAccount
