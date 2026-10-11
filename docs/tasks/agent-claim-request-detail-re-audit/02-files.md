# Files closure parity re-audit

Reference root: `/home/sadegh/Android/project/insurance-ui/src/features/files`.
Target owners: `packages/files/src` (viewer/transport) and `apps/iap-admin/src/modules/files` (upload composition).

## Verified discrepancy task

- [x] F1 — Restore the source image-toolbar tooltip provider. Source `src/components/ui/tooltip.tsx` wraps **each** `Tooltip` in `TooltipProvider` with `delayDuration=0`. Target `@iap/ui` exports the bare Radix root; `packages/files/src/components/image-zoom-pan-viewer.tsx` uses it without any provider. The admin application provider tree has no TooltipProvider. Image attachments can therefore fail on mount, and wrapping in a default provider would still introduce the Radix default delay. Wrap each image-toolbar tooltip locally in the public `TooltipProvider delayDuration={0}`. Keep the already matching reference TooltipContent and Button presentation. Validate an actual mounted image toolbar with the real Radix primitive, including immediate tooltip opening.

## Inspected component and dependency inventory

The following source/target responsibilities were compared individually. Except F1, no visible or behavioral divergence was found in this closure:

| Source file under `src/features/files/` | Target | Evidence |
| --- | --- | --- |
| `components/file-viewer.tsx` | `packages/files/src/components/file-viewer.tsx` | Same empty branch, heading, pager, selected document, prop forwarding and spacing |
| `components/attachment-pager.tsx` | same relative package path | Same buttons, numbers, selected variant, sizing; public reference Button presentation |
| `components/attachment-viewer-content.tsx` | same relative package path | Same loading progress, errors/retry, image/PDF dispatch, heights and props; CSS ordering only |
| `components/file-pdf-viewer.tsx` | same relative package path | Same iframe title, URI, dimensions and loading/error labels |
| `components/image-zoom-pan-viewer.tsx` | same relative package path | Same transform callbacks, persistence, centering, rotation, reset/download, limits and classes; F1 provider omission |
| `components/use-image-viewer-state.ts` | same relative package path | Same per-document keys, transform snapshots, rotation and reset behavior |
| `hooks/use-lazy-documents.ts` | same relative package path | Same downloads, progress, cache, HEIC conversion, cancellation, URL revocation and error labels; narrowed `target` variable replaces equivalent indexed draft |
| `components/file-uploader.tsx` | admin `modules/files/components/file-uploader.tsx` | Same allowed bytes/extensions, maximum slots, sequential upload, conversion, notifications, custom-upload option, progress/failed state, previews and drag/input behavior |
| `components/uploaded-file-preview-list.tsx` | same admin module filename | Same preview grid, PDF icon, image/filename classes and remove button |
| `components/uploading-file-list.tsx` | same admin module filename | Same uploading progress, failed label and clear button |
| `utils/convert-heic-to-jpeg.ts` | package utility; module public re-export | Byte-identical source implementation |
| Source `src/utils/utils.ts` file helpers | `packages/files/src/utils/file-types.ts` | Same signatures, PNG/JPEG/PDF/HEIC/HEIF detection, extension map and MIME sets |
| `services/file-service.ts` | package service; module public re-export | Same POST `/files/upload`, multipart field `file`, GET `/files/download/attachment/${encodeURIComponent(attachmentId)}`, blob mode and progress clamping; request/response boundary validation follows architecture |
| `data/attachment-schema.ts` | `packages/api-types/src/files/index.ts` | Same fields, null/undefined acceptance and loose unknown-key retention; `.nullish()` is the approved equivalent of source nullable/optional |

## Primitives and locale verification

Source `src/components/ui/button.tsx` vs public `@iap/ui` reference Button presentation is already selected by pager, retry, image toolbar, preview deletion and failed-upload dismissal. Source TooltipContent classes, arrow and zero side offset match target reference presentation; provider omission is F1. File closure mounts no dialog.

All 20 actual translation keys in this closure were programmatically compared against source `src/locales/fa.json` and target admin `shared/i18n/locales/fa/common.json`. Every key and Persian value matches exactly: `claimRequests.dialog.fields.attachments`, `common.delete`, `common.retry`, all eight `common.fileUploader.*` keys, and all nine `files.viewer.*` keys. Preserve source wording even where allowed-type labels omit PDF/HEIF.

## Verification status

F1 implemented by wrapping each toolbar Tooltip in a zero-delay public TooltipProvider. The actual mounted image-toolbar test uses real Radix Tooltip and real TransformWrapper (only browser ResizeObserver is supplied for JSDOM), validates six controls and tooltip opening without a global provider. `pnpm --filter @iap/files test`: 8 tests passed across 4 files. `pnpm --filter @iap/files typecheck`: passed. Source comparison and locale equality are static evidence, not browser screenshots or live-backend verification.
