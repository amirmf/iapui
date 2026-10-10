# Task 03: Iranian IBAN Validation and Form Schema

## Context
In `insurance-ui/src/features/my-iap/claim-requests/data/my-bank-account-schema.ts`, Iranian IBAN checksum (ISO 7064 Mod 97-10), bank code identification, temporary bank ignore logic, and RHF Zod form schema are implemented.

## Requirements
1. **Model & Validation (`apps/iap-app/src/features/home/model/my-bank-account-schema.ts`)**:
   - `calculateMod97(value: string): number`
   - `normalizeIranianIban(value: string): string` (`IR` prefix)
   - `getIranianIbanBankCode(value: string): string` (characters 4 to 7)
   - `getIranianIbanBankName(value: string): string | undefined` (mapped via `iranianIbanBanks`)
   - `isValidIranianIban(value: string): boolean`:
     - Checks format `/^IR\d{24}$/`
     - Rearranges: `iban.slice(4) + iban.slice(0, 4)`
     - Replaces chars `A-Z` with `code - 55`
     - `calculateMod97(numericIban) === 1`
   - `isTemporarilyIgnoreIranianIban(value: string): boolean`:
     - Checks if bank code is in `temporarilyIgnoreIbanBankCodes` (`['062', '065', '079', '073', '052', '063']`)
   - `myBankAccountFormSchema(t: (key: string) => string)`:
     - `bankAccountNumber`:
       - `min(1, t('myiap.myBankAccount.messages.numberRequired'))`
       - `length(24, t('myiap.myBankAccount.messages.numberError'))`
       - `regex(/^\d+$/, t('myiap.myBankAccount.messages.numberError'))`
       - `refine(isValidIranianIban, { message: t('myiap.myBankAccount.messages.numberError') })`
       - `refine((val) => isValidIranianIban(val) && !isTemporarilyIgnoreIranianIban(val), { message: t('myiap.myBankAccount.messages.temporaryIbanError') })`
     - `bankAccountType`: `bankAccountTypeSchema` (defaults to `'IBAN'`)
2. **Unit Tests (`apps/iap-app/src/features/home/model/my-bank-account-schema.test.ts`)**:
   - Validate checksum calculation with valid and invalid Iranian IBANs.
   - Validate bank code extraction and bank name resolution.
   - Validate temporary ignore codes return expected error messages.
