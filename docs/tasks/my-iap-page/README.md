# MyIapPage Parity Task Index

This directory documents the granular, component-by-component implementation tasks to bring `MyIapPage` in `iap-app` to 100% reference parity with `insurance-ui` (`src/routes/_app/myiap/index.tsx`).

## Task Index
- [00-overview.md](./00-overview.md): Parity scope, reference mapping, and component structure.
- [01-translations-and-constants.md](./01-translations-and-constants.md): Localization keys in `common.json`, tenant locales, and constant sets (`policy-pdf-ids`, `hoze-support-policy-ids`, `bank-account-constant`).
- [02-api-contracts-and-services.md](./02-api-contracts-and-services.md): Backend API schemas in `packages/api-types` and client service `bank-account-service.ts`.
- [03-iban-validation-and-form-schema.md](./03-iban-validation-and-form-schema.md): Modulo 97 IBAN checksum, Iranian bank lookup, and Zod form validation.
- [04-bank-account-dialog-and-form.md](./04-bank-account-dialog-and-form.md): `MyBankAccountDialog`, `MyBankAccountForm`, and dynamic `IbanBankNameDescription`.
- [05-welcome-alert-and-actions.md](./05-welcome-alert-and-actions.md): `MyClaimWelcomeAlert`, `MyClaimWelcomeActions`, `MyClaimPolicyPdfDownloadActions`, `MyClaimBankAccountAction`, `MyIapSupportAlert`.
- [06-my-iap-page-and-route.md](./06-my-iap-page-and-route.md): `MyIapPage` container, 4 action cards, route integration, unit tests, and validation.
