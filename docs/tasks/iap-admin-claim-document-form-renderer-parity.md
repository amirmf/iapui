# ClaimDocumentFormRendererFrame reference-parity tasks

## Scope and source of truth

Bring `iap-admin` into verified behavioral parity with `insurance-ui/src/features/formio/pages/claim-document-form-renderer-frame.tsx` and the mounted route `insurance-ui/src/routes/formio/claim-requests/$claimRequestId/documents/$documentId/index.tsx`.

Target ownership remains unchanged: Form.io page UI belongs to `apps/iap-admin/src/features/formio`, routes remain thin under `src/app`, and transport contracts belong to `@iap/api-types` plus the Claim Request service.

## Line-by-line discrepancy inventory

| ID      | Reference behavior                                                                                                                                                                                              | Target before execution                                                                                                                                    | Required resolution                                                                                                                     |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| CDF-001 | The `ClaimDocumentFormRendererFrame` reads route IDs, fetches its Claim Request, finds one document, parses Form.io schema/submission, and renders loading, absent-document, absent-schema, or Form.io content. | Component is absent.                                                                                                                                       | Add a focused frame with small parsing, content, and action owners.                                                                     |
| CDF-002 | Reset clones the initial submission and remounts Form.io; save uses the latest data, preserves all other documents, and saves only the selected document's `extractedData`.                                     | No Claim document Form.io state or mutation exists.                                                                                                        | Port the behavior and retain Form.io `onChange`/`onSubmit` semantics.                                                                   |
| CDF-003 | `PATCH /claim-requests/:id` receives `{ documents }` and returns a validated Claim Request.                                                                                                                     | `claimRequestService.updateDocuments` is absent.                                                                                                           | Add the source-backed service method with validated ID, body, and response.                                                             |
| CDF-004 | `Document.dataJsonSchema` and `Document.extractedData` may arrive as either Form.io objects or JSON strings; renderer safely falls back to empty values for malformed input.                                    | Target Claim Request schema restricts `dataJsonSchema` to string and `extractedData` to object records, rejecting valid reference shapes before rendering. | Represent these opaque backend Form.io values as `z.unknown().nullish()` and parse safely inside the feature.                           |
| CDF-005 | Standalone routes exist at `/formio/claim-requests` and `/formio/claim-requests/$claimRequestId/documents/$documentId/`.                                                                                        | Both routes and public feature export are absent.                                                                                                          | Add thin target routes and regenerate the typed route tree.                                                                             |
| CDF-006 | The mounted closure uses the Persian `claimRequests.documents` messages for missing document/schema, unavailable form, save action, and save success.                                                           | Namespace is absent.                                                                                                                                       | Copy every mounted reference key/value verbatim; do not infer or translate.                                                             |
| CDF-007 | Saving provides pending feedback and a success toast; fresh server data replaces local state and the Claim Request detail query is invalidated.                                                                 | No equivalent behavior.                                                                                                                                    | Preserve the source order and use a targeted TanStack Query invalidation.                                                               |
| CDF-008 | The route/component/API contract has no target coverage.                                                                                                                                                        | No focused tests exist.                                                                                                                                    | Add renderer and service tests for branches, latest submission payload, request placement, schema acceptance, and validation rejection. |

## Deliberate non-discrepancies

- The target's `FormioStandaloneLayout`, Form.io/Bootstrap vendor styles, `@iap/ui` buttons, and `sonner` feedback are approved equivalents of the reference dependencies and will be reused.
- No enum value is rendered by this page. An enum-to-translation-key constant would be dead code and is intentionally excluded.
- Target service query cancellation is retained as an architecture-compatible improvement; it does not change the reference's visible behavior.

## Execution checklist

- [x] **CDF-001/002** Added the focused frame with separate parsing, content, and action owners; it preserves Form.io reset, remount, change, submit, and selected-document update behavior.
- [x] **CDF-003/004** Added the validated `updateDocuments` service and update request envelope. The contract now accepts reference-compatible opaque object or JSON-string Form.io values.
- [x] **CDF-005** Added thin Claim Request Form.io routes, the public feature export, and regenerated the typed route tree through Vite.
- [x] **CDF-006/007** Copied all mounted Persian `claimRequests.documents` reference values verbatim and implemented the reference pending, success-toast, fresh-submission, and targeted invalidation sequence.
- [x] **CDF-008** Focused renderer and service tests pass (4 tests). `vite build`, `tsc -b`, ESLint, and `git diff --check` pass.

## Completion evidence

Completed in worktree `codex/iap-admin-claim-document-frame-parity`.

## Reuse decision

No new project skill is needed. This work is a direct application of the
existing `reference-page-parity`, UI/UX, React-performance, TanStack Query, and
Zod guidance; the implementation-specific parsing helpers remain correctly
owned by `features/formio` rather than becoming a workspace-wide abstraction.
