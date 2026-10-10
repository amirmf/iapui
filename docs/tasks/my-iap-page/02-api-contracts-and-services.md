# Task 02: API Contracts and Services

## Context
In `openapidoc.json`, My-IAP customer bank account operations are:
- `GET /api/my/iap/my-bank-account` (operation: `getMyBankAccount`, response: `UserAccountBankAccountNumberDto`)
- `POST /api/my/iap/add-my-bank-account` (operation: `addMyBankAccount`, body: `AddMyBankAccountRequest`, response: `UserAccountBankAccountNumberDto`)
- `PUT /api/my/iap/my-bank-account/{id}` (operation: `editMyBankAccount`, param: `id`, body: `AddMyBankAccountRequest`, response: `UserAccountBankAccountNumberDto`)

## Requirements
1. **API Types Package (`packages/api-types/src/bank-account/index.ts`)**:
   - `addMyBankAccountRequestSchema = z.object({ bankAccountNumber: z.string().min(1), bankAccountType: bankAccountTypeSchema }).strict()`
   - `editMyBankAccountRequestSchema = z.object({ path: z.object({ id: z.uuid() }), body: addMyBankAccountRequestSchema }).strict()`
   - `userAccountBankAccountNumberSchema` / `bankAccountSchema`: object with `id`, `userId`, `bankAccountNumber`, `bankAccountType`, `phoneNumber`, `isValid`, `createdAt`, `updatedAt`. Loose object per Zod v4 rules.
   - Infer types: `AddMyBankAccountRequest`, `BankAccount`.
   - Export from `packages/api-types/src/index.ts`.

2. **Feature Service (`apps/iap-app/src/features/home/services/bank-account-service.ts`)**:
   - `getMyBankAccount(options?: { signal?: AbortSignal }): Promise<BankAccount>`:
     - `GET /my/iap/my-bank-account`
     - Validates response with `bankAccountSchema.parse(response.data)`.
   - `addMyBankAccount(payload: AddMyBankAccountRequest): Promise<BankAccount>`:
     - `POST /my/iap/add-my-bank-account` with validated `payload`.
     - Validates response with `bankAccountSchema.parse(response.data)`.
   - `editMyBankAccount(id: string, payload: AddMyBankAccountRequest): Promise<BankAccount>`:
     - `PUT /my/iap/my-bank-account/${id}` with validated `payload`.
     - Validates response with `bankAccountSchema.parse(response.data)`.
   - Re-export `insurancePolicyService` from `@modules/insurance-policies`.
