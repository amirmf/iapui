# Task 06 — Remaining parity and architecture work

## 06.1 Attachment contract and validation
- **Owner:** `features/my-claims/services` and `features/my-claims/model`.
- Add a typed upload request/response boundary using the existing `attachmentSchema`.
- Move file-type validation out of the view component into a feature utility.
- Validate file signatures (PNG/JPEG/PDF and HEIC/HEIF) before transport; keep MIME checks as a secondary guard.
- Keep upload progress as a callback contract and preserve abort/error handling.

## 06.2 Attachment presentation
- **Owner:** `features/my-claims/pages/create/components`.
- Add previews for image attachments, filename/size rows for non-image files, remove actions, and accessible drag/drop feedback.
- Revoke object URLs on removal/unmount.
- Keep the component independent from HTTP; it consumes the upload service.

## 06.3 Bank-account contracts
- **Owner:** `features/my-claims/model` and `features/my-claims/services`.
- Add strict request/response Zod schemas for get/add/edit bank-account calls using the public `@iap/api-types` bank-account contract where compatible.
- Remove direct `as` casts from service responses.
- Validate Iranian IBAN format before submit and show field-level errors.

## 06.4 Reference visual behavior
- **Owner:** page-owned components.
- Add the reference Info icon and semantic alert classes.
- Preserve accessible labels and focus behavior for upload/remove/dialog actions.
- Use the existing public UI primitives; do not create a parallel UI package.

## 06.5 Verification and architecture audit
- Run feature-scoped typecheck, lint, and tests.
- Confirm route files contain only route composition and loader metadata.
- Confirm services own backend calls, queries own TanStack Query definitions, and model owns Zod contracts.

## Completion

All tasks in this file are implemented in the feature boundary. The current application has no public support-feature-button capability equivalent to the reference, so the field components retain an accessible feature-key hint without introducing an application-internal dependency into `@iap/ui`.

Validation completed with feature-scoped TypeScript, ESLint, and `git diff --check`.

## Task 06.6 — Reference support feature action
- Use the public `@iap/support` `SupportFeatureButton` in both policy and national-code fields.
- Pass exact keys `help_InsurancePolicy` and `help_extNationalCode`.
- Keep support capability in the package boundary; do not recreate it in the feature.

## Task 06.7 — Attachment preview identity
- Key previews by the uploaded attachment's final `filename`/`minioObjectName`, including HEIC-to-JPEG renames.
- Revoke URLs when an attachment is removed or the component unmounts.

## Final verification

Tasks 06.6 and 06.7 are complete. Both reference support actions now use the public `@iap/support` component with exact feature keys, and preview identity follows the uploaded attachment filename after HEIC conversion. Feature-scoped TypeScript, ESLint, and diff checks pass.
