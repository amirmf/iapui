# Task 02: My Claims Create Page (`/myclaims/create/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-create-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/myclaims/create.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/myclaims/create/index.tsx`
- **Target Page**: `apps/iap-app/src/features/claim-requests/pages/create/my-claim-request-create-page.tsx`

## Component Breakdown

1. **`MyClaimRequestCreatePage`** (`pages/create/my-claim-request-create-page.tsx`):
   - Page wrapper with container max width (`max-w-3xl`).
   - Renders `MyClaimRequestPageHeader` with `showBackButton` (navigates back).
   - Renders `Card` containing `MyClaimRequestForm`.
   - On submission success, navigates to `/myclaims/` (note: reference used `/myiap/myclaims`).
2. **`MyClaimRequestForm`** (`pages/create/components/my-claim-request-form.tsx`):
   - React Hook Form controlled by `myClaimRequestFormSchema`.
   - Integrates dependent fields:
     - Policy selection (`MyClaimMyInsurancePolicyFormField`)
     - Insured/dependent selection (`MyClaimMyNationalCodeFormField`)
     - Bank account verification/input (`MyClaimBankAccountAction`)
     - Dynamic document types upload section (`MyClaimRequestFormDocTypes`)
3. **`MyClaimMyInsurancePolicyFormField`** (`pages/create/components/my-claim-my-insurance-policy-form-field.tsx`):
   - Consumes `useGetMyInsurancePolicy` (`GET /my/iap/my-policies`).
   - Displays policy options and selects active policy.
4. **`MyClaimPolicyPdfDownloadActions`** (`pages/create/components/my-claim-policy-pdf-download-actions.tsx`):
   - Provides downloadable policy documents and guidelines for selected policy IDs.
5. **`MyClaimMyNationalCodeFormField`** (`pages/create/components/my-claim-my-national-code-form-field.tsx`):
   - Consumes `useGetMySubInsuredPeople` (`GET /my/iap/sub-insured-people`).
   - Allows selecting main insured or family member/dependent.
6. **`MyClaimBankAccountAction` & `MyBankAccountDialog`** (`pages/create/components/my-bank-account-dialog.tsx`):
   - Checks bank account status (`GET /my/iap/my-bank-account`).
   - If missing or updating, opens `MyBankAccountDialog` with `MyBankAccountForm` (`POST /my/iap/add-my-bank-account` or `PUT /my/iap/my-bank-account/${id}`).
7. **`MyClaimRequestFormDocTypes`** (`pages/create/components/my-claim-request-form-doc-types.tsx`):
   - Renders document upload fields with file validation, size limits, and preview.

## API & Schema Contract

- **Claim Submission**:
  - `POST /claim-requests`
  - Body: `MyClaimRequestPayload` (dates formatted as `yyyy-MM-dd`)
- **Supporting Data APIs**:
  - `GET /my/iap/my-policies` -> `z.array(insurancePolicySchema)`
  - `GET /my/iap/sub-insured-people` -> `z.array(subInsuredPersonSchema)`
  - `GET /my/iap/my-bank-account` -> `userAccountBankAccountNumberSchema`
  - `POST /my/iap/add-my-bank-account` -> `addMyBankAccountRequestSchema`
  - `PUT /my/iap/my-bank-account/${id}` -> `Partial<UserAccountBankAccountNumber>`

## Translation Keys

- `myiap.claimRequests.form.title`
- `myiap.claimRequests.form.description`
- `myiap.claimRequests.form.*` (field labels, placeholders, errors)
- `myiap.bankAccount.*` (dialog title, iban, account number, submit)
- `createClaimPage.*`
- `common.back`
- `common.submit`
- `common.submitting`
