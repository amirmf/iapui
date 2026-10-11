# File viewer closure parity

Priority: P1. Sources: `insurance-ui/src/features/files/components/{file-viewer,attachment-pager,attachment-viewer-content,file-pdf-viewer,image-zoom-pan-viewer,use-image-viewer-state}`, `hooks/use-lazy-documents.ts`, `utils/file-types.ts`, and `services/file-service.ts`.

- [x] Restore `FileViewer` with attachment pager, lazy active-document download, per-document image transform/rotation state, retry/progress, PDF iframe, image zoom/pan/rotate/reset/download controls.
- [x] Match content-header MIME detection, HEIC conversion, object URL cleanup and request cancellation.
- [x] Preserve `GET /files/download/attachment/{encodeURIComponent(id)}` with blob response, progress and cancellation.
- [x] Compare the existing admin implementation against the reference; normalized component/hook/utils bodies match. Only public imports, opt-in reference controls and architecture-required outgoing/Blob validation differ.
- [x] Move the shared viewer closure into focused `@iap/files`, expose its public API and update the admin public module so both apps use the same implementation. Remove the old duplicate admin viewer implementation.
- [x] Copy actual reference Persian labels for every mounted viewer action.

The service retains accepted request/response validation in `@iap/api-types`. Tests migrated with the lifecycle/transport implementation. Aggregate results are recorded in `reference-parity-audit.md`; no live download or visual screenshot parity is claimed.
