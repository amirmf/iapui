# Task 08 — Current-workspace UI and bank form parity

## 08.1 Create-page UI parity
- Keep the existing workspace public primitives and make the create page visually consistent: required markers, alert icon/typography, spacing, focus/error behavior, upload field states, and responsive layout.
- Refactor page-owned components into readable blocks without changing route ownership or introducing UI package internals.

## 08.2 MyBankAccountForm
- Add a feature-owned bank-account form component and compose it from `MyBankAccountDialog`.
- Add strict IBAN request validation (24 digits after optional IR prefix), bank-account loading/reset, add/edit mutation states, field errors, and success feedback.
- Keep bank-account HTTP calls in `my-claim-request-service` and parse every request/response with feature model schemas.

## 08.3 Verification
- Run feature-scoped TypeScript, ESLint, focused tests, and `git diff --check`.
- Verify no route or package boundary is changed.

## Completion

Implemented the feature-owned `MyBankAccountForm`, strict IBAN validation, existing-account loading/reset, add/edit mutations, field errors, loading states, success feedback, and composed dialog. The create-page alert and form primitives use the current workspace's public UI contracts and preserve the reference visual hierarchy.

Feature-scoped TypeScript and ESLint checks pass.

## Final completion

The IBAN implementation now matches the verified reference algorithm: `IR` normalization, rearrangement, alpha-to-number conversion, mod-97 validation, temporary bank-code restriction, bank-code/name mapping, exact Persian validation keys, and bank-name feedback. The form uses translated Zod messages and the service continues to validate transport payloads separately.
