# Task 02: Detail information and readonly items parity

Status: implemented; focused render tests and ESLint pass. Final page integration checks are recorded in the audit document.

## Verified source

- `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-detail-info-list.tsx`
- `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-readonly-items.tsx`
- `insurance-ui/src/utils/format-date.ts`
- `insurance-ui/src/features/my-iap/claim-requests/utils/utils.ts`

## Discrepancies and completed work

- [x] Replace the inlined `DetailItem` with the exact source component names and string-versus-React-node markup. Preserve the border, title, value, grid and badge CSS classes.
- [x] Restore beneficiary national code, zero-capable age and conditional relationship; restore main-person national code and age.
- [x] Restore `en-US` thousands separators, the translated amount fallback and the literal `-` total-amount fallback.
- [x] Restore PAID-without-external-payment-date `SENT_TO_BANK` display and the centralized reference enum translation keys/colors.
- [x] Restore submit date pattern `PP`, creation date, assessed/returned/paid timestamps, raw external payment date, document type fallback and the exact field ordering.
- [x] Preserve source date semantics through public `@iap/ui` formatting options: current i18n language, no automatic timezone normalization, and invalid-date exceptions.
- [x] Keep components page-owned under `features/my-claims/pages/detail/components`, reuse existing query/cache, constants and timestamp helper, and compose conditional classes with public `cn`.

## Validation evidence

`my-claim-request-detail-info-list.test.tsx` contains five passing render tests covering zero/missing values, beneficiary/main-person fields, amount formatting, sent-to-bank and paid states, all conditional dates, English date formatting, explicit and fallback document types, omitted optional fields, and readonly string/node rendering.

Focused component ESLint passed. These checks verify rendered behavior and DOM structure; browser screenshots and live backend verification have not been performed.
