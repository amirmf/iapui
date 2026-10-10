# MyIapPage Parity Task Overview

## Objective
Implement `/` (`_authenticated/index.tsx`) in `apps/iap-app` with 100% parity to reference `insurance-ui` (`src/routes/_app/myiap/index.tsx` and `src/features/my-iap/claim-requests/pages/my-iap-page.tsx`), following `APPLICATION-ARCHITECTURE.md`.

## Reference Mapping
| Feature / Element | Reference (`insurance-ui`) | Target (`apps/iap-app`) |
| --- | --- | --- |
| Route entry | `src/routes/_app/myiap/index.tsx` | `apps/iap-app/src/app/router/routes/_authenticated/index.tsx` |
| Crumb | `myiap` | `myiap` |
| Main Page Component | `MyIapPage` (`src/features/my-iap/claim-requests/pages/my-iap-page.tsx`) | `MyIapPage` / `HomePage` (`src/features/home/my-iap-page.tsx`) |
| Welcome Alert | `MyClaimWelcomeAlert` | `src/features/home/components/my-claim-welcome-alert.tsx` |
| Support Alert | `MyIapSupportAlert` | `src/features/home/components/my-iap-support-alert.tsx` |
| Welcome Actions | `MyClaimWelcomeActions` | `src/features/home/components/my-claim-welcome-actions.tsx` |
| Policy PDF Action | `MyClaimPolicyPdfDownloadActions` | `src/features/home/components/my-claim-policy-pdf-download-actions.tsx` |
| Bank Account Action | `MyClaimBankAccountAction` | `src/features/home/components/my-claim-bank-account-action.tsx` |
| Bank Account Dialog | `MyBankAccountDialog` | `src/features/home/components/my-bank-account-dialog.tsx` |
| Bank Account Form | `MyBankAccountForm` | `src/features/home/components/my-bank-account-form.tsx` |
| IBAN Validation | `my-bank-account-schema.ts` | `src/features/home/model/my-bank-account-schema.ts` |
| Action Cards (4) | 4 cards (claims create/list, special-diseases create/list) | `src/features/home/components/home-action-card.tsx` |

## Task Breakdown
1. `01-translations-and-constants.md`: Localization keys and constants (`policy-pdf-ids.ts`, `hoze-support-policy-ids.ts`, `bank-account-constant.ts`).
2. `02-api-contracts-and-services.md`: Backend Zod schemas in `packages/api-types` and HTTP client service (`bank-account-service.ts`).
3. `03-iban-validation-and-form-schema.md`: Iranian IBAN modulus 97 algorithm, bank name lookup, ignore list, and Zod form schema.
4. `04-bank-account-dialog-and-form.md`: `MyBankAccountDialog`, `MyBankAccountForm`, `IbanBankNameDescription`.
5. `05-welcome-alert-and-actions.md`: `MyClaimWelcomeAlert`, `MyClaimWelcomeActions`, `MyClaimPolicyPdfDownloadActions`, `MyClaimBankAccountAction`, `MyIapSupportAlert`.
6. `06-my-iap-page-and-route.md`: `MyIapPage`, 4 Action Cards, route integration, unit tests, and validation.
