# Doc Types reference-parity implementation tasks

> **Status:** Superseded for the `/doc-types` index page by
> [`iap-admin-doc-types-page-reference-parity.md`](./iap-admin-doc-types-page-reference-parity.md).
> That document is the current source of truth for the page's verified
> discrepancies, implementation status, component names, and test evidence.

## Scope

Implement the authenticated `/doc-types` list page in `iap-admin`, using
`insurance-ui/src/routes/_authenticated/doc-types/index.tsx` and its
`DocTypesPage` composition as the behavioral and visual reference. The target
application's architecture and shared public APIs take precedence where they
differ from the reference project.

## Reference inventory

The reference page composes a paginated document-type query with URL-synchronised
text filtering, refresh, privileged row selection and bulk deletion, row actions,
inline editing, a details dialog, and a delete confirmation.

Already available in the target:

- `@iap/api-types` document-type request/response schemas.
- `@modules/doc-types` document-type service, backed by the API client,
  contract schemas, and shared filter serialization.
- `@shared/tables` paginated table and URL-filter infrastructure.
- `@iap/ui` primitives and `@iap/dialogs` confirmation dialog.
- `@shared/i18n` translation runtime and the existing Persian locale.

Missing target-owned components required for the list-page parity:

1. `features/doc-types/model/doc-type-store.ts`
2. `features/doc-types/ui/doc-type-columns.tsx`
3. `features/doc-types/ui/doc-type-toolbar.tsx`
4. `features/doc-types/ui/doc-type-row-actions.tsx`
5. `features/doc-types/ui/doc-type-inline-edit-row.tsx`
6. `features/doc-types/ui/doc-type-details-dialog.tsx`
7. `features/doc-types/ui/doc-type-delete-dialog.tsx`
8. `features/doc-types/ui/doc-type-bulk-delete-dialog.tsx`
9. `features/doc-types/ui/doc-types-page.tsx` and its public feature export.

The reference's create/edit, Form.io-builder, and sample-submission routes are
not part of the requested `/doc-types` index route and do not exist in the
target. Their navigation controls will therefore not be introduced by this task;
doing so would create dead links. They remain a separately scoped follow-up.

## Implementation checklist

- [x] Consume the existing boundary-validating document-type module; do not
  duplicate its service in the screen feature.
- [x] Add a small feature-local Zustand store for dialog, selected row, inline
  edit, and row-selection UI state. Server data remains in TanStack Query.
- [x] Add the reference-equivalent columns, URL-synchronised `docType` filter,
  and accessible row actions.
- [x] Add inline edit and destructive-action dialogs using target shared form,
  UI, and dialog primitives.
- [x] Compose the page with controlled pagination/filter state and React Query;
  retain the reference's 30-second freshness policy and reset selection on page
  changes.
- [x] Replace the placeholder route with a thin route component and validate its
  table-search shape.
- [x] Copy the required `docTypes` Persian translation keys from the reference.
- [x] Do not add an enum-translation constant: this page renders no enum-backed
  field. Existing enum translation constants are appropriate only where a
  stable backend enum maps to translation keys; localized text belongs in the
  locale file.
- [x] Retain focused service-request tests in the shared module and add a local
  UI-state test. Rendered page behavior remains covered by the reusable table
  tests until a feature-specific interaction test is introduced.
- [x] Run formatting, targeted tests, type checking, linting, and a source-level
  accessibility/responsive review.

## Architectural decisions

- Use `features/doc-types` for screen-specific behavior; keep the route thin.
- Use a Zustand store instead of the reference React context because the target
  architecture assigns feature UI state shared across components to
  `model/store`.
- Reuse `@shared/tables`, `@iap/ui`, and `@iap/dialogs`; do not duplicate shared
  primitives.
- Keep translation keys in `shared/i18n/locales/fa/common.json`, matching the
  target i18n boundary.
