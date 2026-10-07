# Claim request dialog and export re-audit

Source root: `/home/sadegh/Android/project/insurance-ui/src/features/claim-requests/components`.
Target root: `apps/iap-admin/src/features/claim-requests/components`.

## Complete mounted component inventory

| Source component | Target component | Comparison |
| --- | --- | --- |
| ClaimRequestBulkCoreAiDialog | claim-request-bulk-core-ai-dialog.tsx | Same IDs/workflow IDs, trimmed user ID then username then system, messages, count, non-awaited refresh, selection cleanup. |
| ClaimRequestBulkDeleteDialog | claim-request-bulk-delete-dialog.tsx | Same destructive title, descriptions, selection validation, success sequence. |
| ClaimRequestGenerateAndSendBulkDialog | claim-request-generate-and-send-bulk-dialog.tsx | Same title/icon/descriptions, selection validation, non-awaited refresh/cleanup. |
| ClaimRequestBulkStatusChangeDialog | claim-request-bulk-status-change-dialog.tsx | Field order/defaults, request mapping, status enum options, response count, reset and success sequence match; control and pending close differ below. |
| ClaimRequestDeleteDialog | claim-request-delete-dialog.tsx | Same permanent-delete strings, ID validation, refresh/toast/close and 500ms row cleanup. |
| ClaimRequestRowActionsAssignToMeConfirmDialog | claim-request-row-actions-assign-to-me-confirm-dialog.tsx | Same delegated status request, response/current ID fallback, awaited refresh, close, navigation. |
| ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog | claim-request-row-actions-remove-my-assessment-confirm-dialog.tsx | Same ID/doc-type checks, update request, toast, awaited refresh, close; source-absent translation key explicitly falls back to literal key. |
| ClaimRequestDocumentReceiptButton | claim-request-document-receipt-button.tsx | Same field/numeric attributes, reset, blocked pending close, download name, toast and button classes. TextField faithfully composes source FormField/Input; shared Input geometry is assessed separately. |
| ClaimRequestExportExcelButton | claim-request-export-excel-button.tsx | Same export request filters, filename, success toast and outline button; injectable export function missing below. |
| ClaimRequestInquiryFanavaranButton | claim-request-inquiry-fanavaran-button.tsx | Same selection/pending button, confirmation, dedicated error toast, close/clear before awaited callback. |
| ClaimRequestFetchNewEmptyState | claim-request-fetch-new-empty-state.tsx | Same input order/numeric handling, trims/undefined conversion, editable pending inputs, loading spinner/label and success callback; optional callback missing below. |

Management-only dialogs are not mounted by the page and are outside this single-page task. Target-only ClaimRequestRowActionDialogs is an architecture composition wrapper.

## D1 — Restore bulk status scalar searchable control (P1)

- Source: `claim-request-bulk-status-change-dialog.tsx` uses `SearchableSelect` with scalar `value`, `onChange`, and translated status items.
- Target uses object `Select`, whose reference mode still defaults to no search input and a different search placeholder/control implementation.
- Use existing public `SearchableSelect`, reference presentation, source placeholder and common select/loading/noResults/clear translations. Preserve exact field values and enum order.
- Source Dialog forwards open changes even pending; target additionally prevents closing through close icon/Escape while pending. Remove this extra guard. Source cancel/submit and fields remain disabled pending.
- Acceptance: actual scalar control renders search with source placeholder and selection/clear behavior; pending Dialog close forwarded; form submit mapping unchanged.

## D2 — Restore Excel export injection (P2)

- Source header action accepts optional `exportExcel({ filters?, signal? })`, defaulting to service method. Target omits it.
- Restore the same public prop and default while preserving filters and download/toast behavior.
- Acceptance: supplied exporter receives `{ filters }`; service remains default.

## D3 — Restore optional fetch-new callback (P2)

- Source `onFetch` is optional and is invoked with no mutation arguments. Target requires it and assigns it directly as mutation callback.
- Make optional and call `onFetch?.()` through a no-argument callback.
- Acceptance: successful fetch works with and without callback and supplied callback receives no arguments.

## Shared primitive follow-up

Source `components/dialogs/confirm-dialog.tsx` forwards `onOpenChange` directly; target `@iap/dialogs` additionally suppresses changes while loading. Both disable cancel and confirm pending. This shared discrepancy is assigned to the root shared-controls audit; feature confirmation props and success sequences above remain unchanged.

## Status and evidence

Tasks documented before changes. Source files read in full, plus source ConfirmDialog/SearchableSelect and target public controls/form adapters. Verification is source comparison and focused unit checks, not screenshot or live backend parity.

## Implementation evidence

D1–D3 implemented. The public source scalar SearchableSelect replaces the generic object control. Existing form schema/field order and request mapping remain intact. Excel supports the source injected exporter. Fetch-new callback is optional and invoked without response/mutation arguments.

Focused verification: 12 passing tests across `claim-request-dialogs.test.tsx` (5), `claim-request-document-receipt-button.test.tsx` (3), `claim-request-export-fetch-parity.test.tsx` (3), and `claim-request-bulk-status-control-parity.test.tsx` (1). The bulk status test renders real shared form, dialog and searchable control, checking the visible source search placeholder; export/fetch tests cover injection, filename, numeric conversion and callback signature. Scoped ESLint and scoped `git diff --check` pass.

Admin typecheck was attempted during parallel integration and found errors in concurrently edited assessment item, header and info-list files outside this task ownership. Final integrated typecheck is required before this task set is closed. No screenshot or live backend verification is claimed.
