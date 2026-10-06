# Medical Center admin dialog parity

Reference: `insurance-ui/src/features/medical-center/components/`. Target: `apps/iap-admin/src/features/medical-center/components/`. Reusable reference dependencies originate in `insurance-ui/src/features/files/` and are owned by admin `modules/files/`; backend attachment contracts belong to `@iap/api-types`.

## D01 — Upload dialog and uploader (high priority, implemented)

- Current native file input and separate submit action differ from the reference immediate upload/drop area and cancel-only footer.
- Port `FileUploader`, `UploadingFileList`, `UploadedFilePreviewList`, file-signature validation, HEIC conversion, progress/failure entries, single-file slicing, and reference translation keys.
- Upload dialog must call `mutateAsync`, toast success, close immediately, and lock dismissal while mutation or uploader processing is pending.
- Keep the invoice upload endpoint unchanged; custom uploader callback must not call `/files/upload`.

## D02 — Detail dialog and attachment viewer (high priority, implemented)

- Current filename paragraph is missing source attachment eligibility checks, separator, lazy authenticated download, download progress/error/retry, PDF iframe, image zoom/pan/rotate/reset/download, attachment pager, and URL cleanup.
- Port `FileViewer` closure and use source `/files/download/attachment/{encodedId}`.
- Restore `ReadonlyItems` field styling, source spacing, and error/loading semantics.
- Only mount viewer when every source-required file metadata field is present; wrapper image height is `30vh`.

## D03 — Edit dialog (high priority, implemented)

- Current reset effect omits dirty-state dependency; close incorrectly checks mutation pending inside success callback, potentially preventing success close.
- Restore source reset/close sequencing, state placeholder, date-clear handling and host locale; use reference presentation for primitives.
- Preserve full detail merge and update only dirty values with source empty-date representation.

## D04 — Delete dialog (medium priority, implemented)

- Add source pending/id guard to confirm handler. Preserve source error toast, success close and document-number interpolation.
- Continue using `@iap/dialogs` public reference confirmation capability.

## Verification

Verified: 13 focused tests covering custom immediate invoice upload, signature validation, rejected-upload entries, exact attachment mapping and zero-byte metadata, pending delete guards and success/error sequencing, multipart upload, encoded blob download with progress and abort signal, lazy download retry, object URL cleanup and late response cancellation. Affected admin dialog/module lint and `@iap/ui` typecheck pass. Architecture boundary checks pass. Admin typecheck reports only pre-existing `outpatient-doc-acceptances` service import errors; no Medical Center or files errors were reported. `git diff --check` passes. Browser screenshots and real-backend tests are outside the user's requested scope. No pixel-identical rendering claim is made from unit tests.

## Architecture adaptations

- `FileUploader` and `FileViewer` retain source component names and behavior, but their reusable capability lives in `apps/iap-admin/src/modules/files`; consumers use its public API.
- Attachment schemas live in `packages/api-types/src/files` and preserve source loose attachment-response semantics. Request and Blob-response boundary schemas add target-required validation without changing reference paths, fields or response consumption.
- `ReadonlyItems` reuses the existing source-equivalent shared admin component. The new public `@iap/ui` `Separator` reproduces the reference decorative/orientation/data-slot/classes with a native div rather than adding a Radix dependency.
- Edit text/date fields use `@iap/forms` public ready-made bindings; source labels, layout, numeric flags, date clear behavior and field validation remain unchanged. Source scalar state selector composition retains `SingleSelect` and forwards literal translated loading/empty/clear labels.
- Buttons, dialog contents and image toolbar tooltips opt into source presentation; default shared consumers are unaffected.
- Added only source dependencies `heic-to` and `react-zoom-pan-pinch` to admin. No application code was added to `iap-app`.

## Exact locale keys delegated to integration

Copy from reference `src/locales/fa.json`: `common.fileUploader`, `files.viewer`, `claimRequests.dialog.fields.attachments`, and source scalar select keys `common.clear`, `common.select`, `common.loading`, `common.noResults`. Global locale edits are integrated by the parent task.

## Integrated completion evidence

See MEDICAL-CENTER-ADMIN-RECONCILIATION.md for final verification, approved contract precedence and the unrelated full-admin typecheck limitation. No UI/browser pixel parity is claimed from tests.

## Verification update

At the user’s explicit request, unrelated uncommitted outpatient-doc-acceptances additions were removed and its existing API contract file restored. Full iap-admin typecheck now passes. git diff --check also passes.

## Historical audit notice

This audit is superseded by MEDICAL-CENTER-FINAL-REAUDIT.md and its table/dialog companion audits.
