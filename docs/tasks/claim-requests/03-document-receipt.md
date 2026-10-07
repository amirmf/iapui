# CRP-2026-03 — ClaimRequestDocumentReceiptButton

Evidence: reference components/claim-request-header-actions/index.tsx, claim-request-document-receipt-button.tsx; data/claim-request-document-receipt-schema.ts; service exportDocumentReceipt. Target header currently omits the first unconditional PDF button.

- [x] Add canonical exportClaimRequestDocumentReceiptRequestSchema/ResponseSchema/types in @iap/api-types. extMainNationalCode string.trim().min(1); response Blob. Transport GET /claim-requests/export-report/pdf, query national code, responseType blob, optional AbortSignal. Both boundaries parsed.
- [x] Add feature form schema with exact translated required message. Use shared forms/UI, numerical input, inputMode numeric, autoComplete off, maxLength 10, empty default.
- [x] Match yellow button, dialog title/label, cancel/submit, pending loading text; pending prevents close and disables input/cancel/submit.
- [x] Success saveAs document-receipt-{trimmedCode}.pdf, toast downloaded, reset then close. Failure retains form/dialog through global mutation error handling.
- [x] Copy claimRequests.documentReceipt subtree verbatim; common.cancel/loading use verified existing values.
- [x] Test request path/query/Blob validation, whitespace rejection, pending guards and success/failure lifecycle.

Final verification: complete admin suite passed (193 files / 549 tests); shared UI passed 58 tests and forms passed 11 tests. After the final memoization/URL-adapter edit, 24 affected files / 71 tests passed, including three new URL transition tests. Workspace typecheck, lint and architecture checks passed; final affected-file lint and git diff --check passed. Source/automated coverage only; no browser screenshots or live backend check.
