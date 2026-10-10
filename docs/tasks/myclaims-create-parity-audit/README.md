# MyClaimRequestCreatePage reference parity audit

Source of truth: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-create-page.tsx` and its imported components. Target: `iap-app/src/features/my-claims/pages/create`.

Implementation starts only after the discrepancies below are recorded. Every name, key, endpoint, and schema listed here was read from the reference source.

## Completion audit — 2026-10-10

Implemented in the `myclaims-create-parity` worktree:

- Page/route composition and feature-owned page structure.
- Feature-owned form contract under `features/my-claims/model`.
- Dedicated policy, national-code, and document-type field components.
- Deferred document-type search and `others` handling.
- Real `/files/upload` attachment upload with allowed-type filtering and upload state.
- Invalid-Sheba confirmation and bank-account dialog using the reference endpoints.
- Reference payload serialization and response validation.
- First-error scrolling, mutation invalidation, reset behavior, and reference translation keys.

Architecture review: route remains a thin composition boundary; API calls remain in feature services; schemas live in feature model; page components do not own backend transport; workspace packages are consumed only through public APIs.

### Status: partially complete

The following reference-level differences remain and keep Tasks 02–04 open: the uploader does not yet implement the reference drag/drop, magic-byte detection, HEIC conversion, progress entries, previews, and removal UI; the document-type query is still declared inside the field instead of a dedicated service/query boundary; support feature buttons are represented as screen-reader-only text; amount input is still the shared numeric input rather than the reference `InputAmount`; and the bank-account form does not yet use the reference IBAN schema and validation contract. These are documented discrepancies, not completed parity.

### Follow-up remediation

Task 05 was implemented: upload transport and document-type querying now follow feature service/query boundaries; the uploader supports drag/drop, allowed-type filtering, progress, and removal; amount uses the existing public numeric input contract rather than introducing a duplicate `InputAmount` component.
