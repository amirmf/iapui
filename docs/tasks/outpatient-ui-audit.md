> Historical: completion claims superseded by `outpatient-doc-acceptances-reconciliation.md`.

# OutpatientDocAcceptancesPage parity audit

Reference: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/outpatient-doc-acceptances/index.tsx` and feature closure under `src/features/outpatient-doc-acceptances`.
Target: `apps/iap-admin/src/features/outpatient-doc-acceptances` and route.

## Status

Audit rechecked on 2026-10-06. Route and provider/store skeleton are complete;
the mounted dialog closure and exact page action parity remain incomplete.

## P0: page composition and mounted closure

- Target page (`outpatient-doc-acceptances-page.tsx`) renders only the table surface and refresh action. Reference wraps content in `OutpatientDocAcceptanceProvider`, has a separate content component, and mounts all dialogs: `OutpatientDocAcceptanceFormDialog`, `GenerateDialog`, `GenerateAdjustmentDialog`, `SendDialog`, `ViewDialog`, `CancelDialog`, `TerminateDialog`, `DeleteDialog`, `DeleteMethodDialog`, `OutpatientClaimFormDialog`, `OutpatientClaimViewDialog`, `IssuanceFormDialog`, `IssuanceViewDialog`, and `DamageCasesDialog`.
- Provider/store now exist under `context/provider` and `context/store`, but the
  page now mounts dialog entry points and orchestrates their store state; exact
  field-level behavior is covered by the repository-level focused tests.
- Reference page has top actions: permission-gated bulk delete, generate, generate adjustment, sync inquiry statuses, create; target has refresh only. Implement exact labels, icons, disabled/pending behavior, permission (`isSuperAdmin`), mutations and toast sequencing.
- Reference table enables row selection and checkboxes, passes selection to bulk-delete dialog, and clears selection after dialog close; target has no row selection.
- Reference uses `Main` layout behavior; target uses a custom surface. Verify target architecture's approved page shell and reproduce reference spacing/layout.

## P0: missing reference components (one task per component)

Target has no equivalent for these reference files; copy their verified UI, API calls, schemas and translations into target feature architecture:

- `components/damage-cases-dialog.tsx`
- `components/damage-cases-table.tsx`
- `components/dmg-case-form-dialog.tsx`
- `components/dmg-case-view-dialog.tsx`
- `components/issuance-form-dialog.tsx`
- `components/issuance-view-dialog.tsx`
- `components/outpatient-claim-form-dialog.tsx`
- `components/outpatient-claim-view-dialog.tsx`
- `components/outpatient-doc-acceptance-cancel-dialog.tsx`
- `components/outpatient-doc-acceptance-delete-dialog.tsx`
- `components/outpatient-doc-acceptance-delete-method-dialog.tsx`
- `components/outpatient-doc-acceptance-form-dialog.tsx`
- `components/outpatient-doc-acceptance-generate-adjustment-dialog.tsx`
- `components/outpatient-doc-acceptance-generate-dialog.tsx`
- `components/outpatient-doc-acceptance-send-dialog.tsx`
- `components/outpatient-doc-acceptance-terminate-dialog.tsx`
- `components/outpatient-doc-acceptance-view-dialog.tsx`
- `context/outpatient-doc-acceptance-context.tsx`
- `stores/damage-cases-dialog-store.ts`

Each component must retain the exact reference action names, dialog open keys, field order, validation behavior, mutation endpoint/body, success/error toast keys, and invalidation/refetch sequencing.

## P0: columns and row actions

- `outpatient-doc-acceptance-columns.tsx` differs materially. Reference columns are ordered `exId/letterNo`, `deliveryDate/updatedAt`, `totalAmount/claimCount`, `policyId`, `inqueryStatusTitle/inqueryStatusId`, `opUnitId/extLocationId`, `status/wsStatus`, `terminate`, `actions`. Target instead shows policy paired with claim number, inquiry paired with ext location, lacks letterNo/inqueryStatusId/opUnitId/wsStatus and terminate button, and has different max-width metadata.
- Reference status cell renders both status and optional `wsStatus` badges with centralized translation-key maps and color maps; target renders only one status badge and derives labels by replacing underscores. Port exact constants and fallback behavior.
- Reference `row-actions.tsx` is a dropdown menu with view/edit/manage claim/manage issuance/manage damage cases/send/cancel/terminate/delete. Target exposes only Excel/PDF downloads and claim-request link. Preserve target's export capability if required by accepted behavior, but add every reference action and exact menu accessibility text.
- Reference row actions receive the full TanStack row and call context `openDialog`; target receives ids only.

## P0: service/API/schema closure

- Target service only implements page, XLS and PDF export. Reference service includes getById, create, update, delete, bulk delete, generate, generate adjustment, submit/send, cancel, terminate, sync inquiry statuses, claim CRUD, issuance CRUD, damage-case CRUD and lookup calls. Port only calls reached by mounted dialogs, with exact paths, HTTP methods, query/body placement and response schema parsing.
- Target API types do not currently expose the reference form/detail schemas. Add equivalent contracts in the target API-types ownership boundary, preserving nullable/optional fields and nested response schemas from reference `data/outpatient-doc-acceptance-schema.ts`.
- Target service sends only page/filters through `transformApiFilterParams`; verify every mutation's request mapping and date/number/boolean normalization against reference service.

## P0: constants and translations

- Compare `constants/outpatient-doc-acceptance-status-constant.ts` in reference with both target status files (`features/outpatient-doc-acceptances/constants` and `features/claim-reports/constants`). Target currently has only a subset/status map; add exact status and WS-status translation-key/color maps and keep enum maps centralized.
- Extract every `outpatientDocAcceptances.*`, `common.*`, lookup and validation translation key used by the mounted reference closure. Values must match reference locale files exactly; do not infer Persian text. Record source-only literal fallbacks where no target key exists.

## P1: toolbar, URL state and table behavior

- Compare toolbar filter IDs and placeholders exactly. Verify reference filter utility defaults, URL query key names, page reset on filter changes, debounce/clear behavior, selected faceted option absence, and sort defaults. Target's custom parser currently forces `exId desc`; reconcile with reference defaults and preserve exact URL semantics.
- Reference toolbar/table uses source's pagination labels, empty-state prop (`emptyStateText`), checkbox selection, and table column visibility semantics. Verify target shared `PaginatedDataTable` mapping rather than assuming equivalent props.
- Ensure loading, previous-data placeholder, query error behavior, empty state and refetch behavior match reference.

## P1: detail flows and side effects

- View/edit dialogs must load full detail by ID and render all reference fields in exact order.
- Create/edit success must close, toast, invalidate/refetch, and preserve failure-open behavior exactly.
- Generate/send/cancel/terminate/delete/bulk-delete and sync-status actions must match reference pending state, confirmation behavior, toast text and invalidation sequencing.
- Claim, issuance and damage-case dialogs must preserve nested lookup loading/error/empty states and store/context open transitions.
- Verify terminate is available both as the dedicated table column action and row-action menu.

## P2: verification

- Add focused contract tests for every service request path/method/body/query and schema acceptance, including nullable nested detail fields and invalid payloads.
- Run affected tests, typecheck, lint and `git diff --check`. Browser screenshot,
  pixel-perfect comparison, and live-backend verification are explicitly out of
  scope for acceptance.
