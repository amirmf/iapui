---
name: shared-dialogs
description: Add or use IAP confirmation, delete, audit, and forced-password dialogs while preserving package, API, and translation boundaries.
---

# Shared dialogs

Use this skill when a page needs an existing IAP dialog or a new reusable
dialog composition.

## Placement

- Keep Radix-level primitives in `@iap/ui`.
- Use `@iap/dialogs` for reusable confirmation and delete-flow compositions.
- Keep dialogs that call auth endpoints, such as audit information and forced
  password change, in `@iap/auth`.
- Keep product-journey dialogs within the owning feature. Do not add them to a
  shared package merely because they render in a dialog.

## Contracts and localization

- A reusable dialog does not own query keys, request invalidation, toasts, or
  feature stores. The caller owns those behaviors.
- For every endpoint used by a shared dialog, define request and response Zod
  schemas in `@iap/api-types` and validate both sides in the package service.
- Match the established endpoint and schema contract before adapting a dialog
  from the reference project.
- Reuse keys from each application's `src/shared/i18n/locales/fa/common.json`.
  Shared packages may call the host i18next runtime but must not carry locale
  resources.

## Existing public components

- `@iap/dialogs`: `ConfirmDialog`, `VariantConfirmDialog`, and
  `DeleteMethodDialog`.
- `@iap/auth`: `ForcePasswordChangeDialog`, `AuditInformationDialog`, and
  `useAuditInformationDialogStore`.

Mount the two `@iap/auth` global dialogs once in an authenticated application
shell. Feature code opens the audit dialog through the exported store; it must
not render another dialog host per table row.

## Reference-page presentation

For a source-backed parity task, `ConfirmDialog` and `DeleteMethodDialog`
support opt-in `presentation='reference'`. This passes through the shared
Dialog/AlertDialog presentation without changing unrelated consumers.
`DeleteMethodDialog` accepts a caller-selected `resetDelay`; copy the source
timing instead of applying one global default. Its rejected operation callback
keeps confirmation open; the caller's mutation/global error handler reports
the failure. Do not swallow the error in the caller and resolve the operation,
which would incorrectly close the shared dialog.

Read `docs/architecture/REFERENCE-PAGE-CONTROLS.md` when porting dialog/date
behavior from the reference. Product-specific cleanup timers remain owned by
the feature, not the reusable composition.
