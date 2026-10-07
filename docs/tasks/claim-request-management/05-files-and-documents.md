# 05 — Attachments and extracted documents

Status: implemented; focused verification passed, integration verification pending.
Priority: P1. Owner: iap-admin claim-requests management page. No management subpage is introduced.

## Verified source closure

All source paths below are relative to `/home/sadegh/Android/project/insurance-ui`.

- `src/features/claim-requests/pages/claim-request-management-page.tsx`: normalizes attachments/documents with `Array.isArray`, mounts attachments in the right column, mounts documents after previous requests.
- `src/features/claim-requests/components/claim-request-attachments-section.tsx`: `ClaimRequestAttachmentsSection`, hides only when input attachment array is empty; 75vh card, 100% transform wrapper width/height.
- `src/features/files/components/file-viewer.tsx`: `FileViewer` composes `AttachmentPager`, `AttachmentViewerContent`, `useLazyDocuments`, `useImageViewerState`.
- `src/features/files/components/attachment-pager.tsx`: one numbered small button per visible attachment, selected default variant, others outline. Key uses minioObjectName then index.
- `src/features/files/components/attachment-viewer-content.tsx`: idle/missing is empty; loading shows progress in 65vh area; error shows actual error/fallback and retry; loaded image uses `ImageZoomPanViewer`, PDF uses `FilePdfViewer`; unsupported MIME renders nothing.
- `src/features/files/components/file-pdf-viewer.tsx`: blob URL iframe, filename title or literal `PDF document`, height 65vh. No separate PDF download action is mounted.
- `src/features/files/components/image-zoom-pan-viewer.tsx`: zoom, reset, rotate left/right by 90 degrees and download buttons with translated tooltips/accessible labels. Scale range 0.25–6, wheel step 0.001, double click disabled, no bounds limit. Pan/pinch/zoom state persists by image key. Initial center transform is captured after load; reset restores initial transform and zero rotation. Download creates a temporary anchor from active blob URL (source filename derived from URL, fallback `attachment`).
- `src/features/files/components/use-image-viewer-state.ts`: stable key from nonblank id/url/src/path, otherwise `index:${index}`; per-image scale/position/rotation state. Saves current image state before selection.
- `src/features/files/hooks/use-lazy-documents.ts`: removes `metadata.name === 'enhanced'`; downloads selected item only; switching cancels other in-flight downloads; loaded documents remain cached within hook; missing id produces loadFailed; retry only via force; request symbols discard stale completion/progress; input change/unmount cancels downloads and revokes blob URLs.
- `src/features/files/utils/convert-heic-to-jpeg.ts`: dynamic `heic-to`, JPEG quality 1.
- `src/utils/utils.ts`: first 32-byte signatures detect PNG/JPEG/PDF/HEIC/HEIF; header detection precedes attachment MIME fallback; image MIME set includes jpeg/jpg/png/webp/bmp/gif/svg+xml/tiff, PDF is application/pdf only.
- `src/features/claim-requests/components/claim-request-documents-section.tsx`: `ClaimRequestDocumentsSection` wraps content in Permission; allowed admin roles are ROLE_ADMIN_USER, ROLE_SUPER_ADMIN, ROLE_SUPER_ADMIN_USER and pathname must not start with `/agent`. Card title is claimRequests.documents.title.
- `src/features/claim-requests/components/claim-request-documents.tsx`: `ClaimRequestDocuments`, controlled tabs in host language direction. Key is document.id ?? document.documentType ?? string index. Selected key persists if still present, otherwise first; empty data clears it. Document title is documentType ?? common.notAvailable. Missing/falsy id renders unavailable. Frame URL is `(BASE_URL ?? '/').replace(/\/$/, '') + /formio/claim-requests/{encoded claimRequestId}/documents/{encoded documentId}/`. Frame title interpolates docType; height 85vh, min-height source class min-h-150.
- `src/features/documents/components/document-viewer.tsx` is **not mounted** by this page: do not add its JSON viewer.

## API and contracts

- `src/features/files/services/file-service.ts`: selected attachment calls GET `/files/download/attachment/${encodeURIComponent(attachmentId)}` with blob response, AbortSignal, download progress. No upload is mounted by these sections. Reuse target `modules/files` public FileViewer and existing schemas/service, without adding an uploader.
- `src/features/files/data/attachment-schema.ts`: attachmentSchema is loose; optional nullable id/metadata, required filename/fileType/fileSize/uploadDate/minioObjectName/bucketName. Target `packages/api-types/src/files/index.ts` already matches acceptance and transport validation.
- Full claim response uses `src/features/claim-requests/data/claim-request-schema.ts` claimDocumentSchema: loose, nullable optional id/docTypeCode/documentType/dataJsonSchema(string)/extractedData(record)/extractionDate/extractionModel. Preserve this distinct full-response contract.
- Editable document type comes from `src/features/documents/data/document-schema.ts` documentSchema: ordinary stripping object; optional nullable id/documentType/docTypeCode/docType/extractionDate/extractionModel, any optional nullable extractedData/dataJsonSchema. Add separate `packages/api-types/src/document/index.ts`, exported through public package API. Do not replace claimDocumentSchema with it.
- Existing embedded renderer closure: `src/routes/formio/claim-requests/$claimRequestId/documents/$documentId/index.tsx`, `src/features/formio/pages/claim-document-form-renderer-frame.tsx`, `src/features/formio/components/formio-standalone-layout.tsx`. The target already owns this capability. It loads GET `/claim-requests/{id}` with key `['claimRequest', id]`, finds document, parses JSON/object schema/submission, supports save/reset, PATCH `/claim-requests/{id}` body `{documents: updatedWholeArray}`. Success resets frame state and awaits invalidation of the same claim key. Reuse it, not a new management child route. Do not change its existing outgoing request validation during this task.

## Target placement and bounded steps

1. Verify existing `apps/iap-admin/src/modules/files` closure and tests; reuse public `@modules/files` FileViewer, `@iap/ui` primitives and `@iap/api-types` contracts.
2. Add the exact three section/component names under `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/`; business permission belongs in section, never route.
3. Keep document selection close to ClaimRequestDocuments and preserve source state transitions, iframe path/escaping, labels and empty states. Use props destructuring in body and public cn for conditional classes.
4. Wire page arrays and placement in page composition task. No API calls belong in route/section components.
5. Add focused behavior tests for hidden attachments, admin permission, empty documents, missing id, encoded iframe URL, initial selection and removal fallback. Existing download tests cover transport/cancellation/header detection; rerun affected tests.

## Translation evidence

Verified from source `src/locales/fa.json` programmatically. Extract corresponding English values from en.json rather than translating.

| Key | Persian value |
| --- | --- |
| claimRequests.dialog.fields.attachments | پیوست‌ها |
| claimRequests.documents.title | اسناد خسارت |
| claimRequests.documents.empty | هیچ سندی برای این درخواست خسارت موجود نیست. |
| claimRequests.documents.modalTitle | فرم سند: {{docType}} |
| claimRequests.documents.unavailable | امکان نمایش فرم برای این سند وجود ندارد. |
| common.notAvailable | در دسترس نیست |
| common.retry | تلاش دوباره |
| files.viewer.loading | در حال بارگذاری پیوست... |
| files.viewer.progressValue | {{percent}}% |
| files.viewer.loadFailed | بارگذاری پیوست امکان‌پذیر نبود. |
| files.viewer.actions.zoomIn | بزرگ‌نمایی |
| files.viewer.actions.zoomOut | کوچک‌نمایی |
| files.viewer.actions.resetView | بازنشانی نما |
| files.viewer.actions.rotateLeft | چرخش به چپ |
| files.viewer.actions.rotateRight | چرخش به راست |
| files.viewer.actions.downloadImage | دانلود تصویر |

The already implemented Formio renderer additionally uses common.reset/loading, claimRequests.documents.actions.save, unavailable/missingDocument, messages.updateSuccess/missingSchemaTitle/missingSchemaDescription. No enums are rendered by these components.

## Acceptance and evidence limits

- Preserve exact component names and source visible branches; no JSON viewer, uploader, new subpage, or invented download button.
- Reuse files/Formio public boundaries. Confirm editable document stripping and broad field acceptance independently from full claim document validation.
- Tests prove contracts and behavior; visual parity requires browser inspection and authenticated backend data and must not be claimed solely from passing tests.
- Required checks: affected component/module tests, typecheck, lint, git diff --check. Record actual results before marking complete.

## Verified implementation evidence

Implemented the three source-named section/components and distinct editable documentSchema domain. Reused FileViewer and existing Formio renderer. Four document tests and seven affected file module tests passed (11 tests total): iframe encoding/tab removal fallback, permission, empty/missing-id states, editable schema broad fields/stripping, cancellation, download placement and header detection. Whole-workspace typecheck/lint and browser/backend verification remain integration responsibilities.
