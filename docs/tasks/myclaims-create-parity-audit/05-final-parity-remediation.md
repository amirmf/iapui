# Task 05 — Final parity remediation

## Verified decisions
- `@iap/ui` `Input` supports `numerical` and `numberWithComma`; there is no `InputAmount` in the current workspace. The create form must use this public primitive, preserving the reference's numeric-only and comma-formatted behavior without adding a duplicate component.
- File upload belongs to the feature page's private components because the app has no shared files module. Transport remains in the feature service; the component consumes a typed upload service and must not call backend transport directly.
- Document-type fetching belongs in a feature query/service boundary, not inside the field component.

## Implementation tasks
1. Move file upload transport to `my-claims/services/file-upload-service.ts`, validate response with `attachmentSchema`, and expose progress.
2. Upgrade the feature-local `FileUploader` with reference behavior: allowed image/PDF types, drag/drop, progress state, previews, removal, upload state callback, and HEIC conversion through the workspace `heic-to` dependency.
3. Replace direct doc-type transport with `my-claims/services/doc-type-service.ts` and `queries/doc-types-query.ts`.
4. Keep amount input on `@iap/ui` `Input` with `numerical` and `numberWithComma`; document why no `InputAmount` is introduced.
5. Re-run architecture checks, lint, typecheck, and diff validation.

## Verification

Completed: amount uses the existing public `@iap/ui` `Input` numeric primitives; upload transport is service-owned and response-validated; document-type transport is service/query-owned; uploader now supports drag/drop, filtering, progress, previews by filename, and removal. Typecheck, lint, and `git diff --check` pass for the feature scope.
