# Task 04: Bank Account Dialog and Form

## Context
In `insurance-ui`, users register or update their IBAN account inside a modal dialog (`MyBankAccountDialog` and `MyBankAccountForm`).

## Requirements
1. **`IbanBankNameDescription` Component (`apps/iap-app/src/features/home/components/iban-bank-name-description.tsx`)**:
   - Accepts `bankAccountNumber: string`.
   - Computes `bankName = isValidIranianIban(bankAccountNumber) ? getIranianIbanBankName(bankAccountNumber) : undefined`.
   - Renders `<FormDescription>{bankName}</FormDescription>` when valid bank name is resolved.

2. **`MyBankAccountForm` Component (`apps/iap-app/src/features/home/components/my-bank-account-form.tsx`)**:
   - Uses `useForm<AddMyBankAccountRequest>` with `zodResolver(myBankAccountFormSchema(t))`.
   - Queries `['myBankAccount']` via `bankAccountService.getMyBankAccount` (`retry: false`).
   - Syncs form values with loaded account data (`bankAccountNumber`, `bankAccountType: 'IBAN'`).
   - Mutation via `useMutation`:
     - If existing `id`: calls `bankAccountService.editMyBankAccount(id, values)`.
     - Else: calls `bankAccountService.addMyBankAccount(values)`.
     - On success: invalidates `['myBankAccount']`, shows toast `t('myiap.myBankAccount.messages.saved')`, calls `onSuccess?.()`.
   - Input field: `bankAccountNumber` with `dir='ltr'`, numerical input formatting, label `t('myiap.myBankAccount.fields.number')`, placeholder `t('myiap.myBankAccount.fields.numberPlaceholder')`.
   - Submit button with pending state:
     - `t('myiap.myBankAccount.actions.saving')` when pending
     - `t('myiap.myBankAccount.actions.edit')` when editing existing account
     - `t('myiap.myBankAccount.actions.create')` when creating new account

3. **`MyBankAccountDialog` Component (`apps/iap-app/src/features/home/components/my-bank-account-dialog.tsx`)**:
   - Uses `@iap/ui` `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`.
   - DialogTitle: `t('myiap.myBankAccount.dialog.title')`.
   - DialogDescription: `t('myiap.myBankAccount.dialog.accountName1')` + user display name + `t('myiap.myBankAccount.dialog.accountName2')`.
   - Body: renders `MyBankAccountForm` with `onSuccess={() => onOpenChange(false)}`.
