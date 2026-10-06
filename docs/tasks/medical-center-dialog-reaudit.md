# Medical Center dialogs: fresh source audit

Reference root: `/home/sadegh/Android/project/insurance-ui/src`.
Target owner: `apps/iap-admin/src/features/medical-center`.

This audit compares the current files, rather than relying on earlier completion claims.

## D01 — Edit state selection trigger (high)

- Reference: `components/select/single-select.tsx`, mounted by `features/medical-center/components/medical-center-invoice-edit-dialog.tsx`.
- Target: `packages/ui/src/searchable-select.tsx` and the admin edit dialog.
- Difference: popup already uses reference presentation, but the trigger uses the default shared Button presentation. Source trigger uses the reference Button styling.
- Task: expose an optional trigger presentation, preserve existing consumers' defaults, and opt the medical-center edit state control into reference presentation.
- Acceptance: focused primitive test checks reference and unchanged default trigger classes; existing selection/loading/clear tests pass.
- Status: complete; 5 scalar-select tests pass, including unchanged default and opt-in trigger presentation.

## D02 — Edit date clear label (high)

- Reference: `components/date-picker/date-picker.tsx` supplies `t('common.clear')` to the clear button.
- Target: edit `DatePickerField` uses the primitive's English `Clear date` default.
- Task: forward the exact source translation key; use source's exact `i18n.language === 'fa'` calendar choice.
- Acceptance: render actual edit controls with a selected date and verify the clear button's label and clearing behavior.
- Status: complete; actual edit-control test verifies source label and empty-string dirty-date update payload. Both edit tests pass.

## Verified closure

Compared all four `medical-center-invoice-*-dialog.tsx` files. Upload callback/progress lock, detail metadata guard/attachment mapping/seven readonly fields, edit defaults/reset/dirty merge/submission, and delete pending/error/success sequencing match source. Target uses public packages, absolute imports and approved reference presentations as architecture adaptations.

Compared `modules/files/components/{file-uploader,file-viewer,attachment-viewer-content,attachment-pager,file-pdf-viewer,image-zoom-pan-viewer,use-image-viewer-state,uploaded-file-preview-list,uploading-file-list}.tsx`, `hooks/use-lazy-documents.ts`, and `services/file-service.ts` against the equivalent reference `features/files` files. Their implementation differs only in ownership/imports, public reference presentation, type-only imports and API-boundary validation. Uploaded/failed previews, HEIC conversion, retry, lazy downloads, image transforms, PDF rendering and attachment pagination are retained. Compared ReadonlyItems and shared confirmation composition with their source counterparts. No new API, component names or translation values are invented.

Verification below is file/contract and rendered-control testing; no live backend or pixel-identical screenshot claim is made.

Clearing a selected date emits `undefined` and submits the source empty-string dirty-field payload. With the current React Hook Form version, the input can retain the reset default date display because `field.value` falls back to that default. Both source and target render that field value; this audit does not invent an unrelated form behavior change or claim the display issue differs from the running reference.

Verification: 13 existing dialog/files tests passed; 2 actual edit-control tests and 5 scalar-select tests passed after the edits. Scoped admin lint passed. Integrated typecheck results are recorded by the parent audit.
