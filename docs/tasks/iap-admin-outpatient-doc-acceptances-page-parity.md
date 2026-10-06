> Historical: completion claims superseded by `outpatient-doc-acceptances-reconciliation.md`.

# iap-admin outpatient document acceptances parity

## Status

Discovery complete; implementation and repository-level verification are
complete. Backend-live and pixel-perfect verification are explicitly out of
scope. The target route is now
implemented at
`apps/iap-admin/src/app/router/routes/_authenticated/outpatient-doc-acceptances/index.tsx`.

## Verified reference closure

- Reference route: `insurance-ui/src/routes/_authenticated/outpatient-doc-acceptances/index.tsx`.
- Page: `insurance-ui/src/features/outpatient-doc-acceptances/pages/outpatient-doc-acceptances-page.tsx`.
- Page composition: provider/context, server-paginated table, URL-synchronised
  filters, refresh/sync/generate actions, row selection, and the following
  mounted dialogs: acceptance form/generate/generate-adjustment/send/view/cancel/
  terminate/delete/delete-method, claim form/view, issuance form/view, and
  damage-cases (including damage-case form/view/table).
- Reference service methods verified in
  `insurance-ui/src/features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service.ts`:
  page, get-by-id, report/PDF export, acceptance create/update/generate/
  adjustment-generate/send/delete, claim get/create/update/delete, inquiry
  status sync, issuance get/create/update/delete, damage-case list/get/create/
  update/delete, cancel, terminate, soft-delete, and bulk-delete.
- Reference contract and enum values are in
  `insurance-ui/src/features/outpatient-doc-acceptances/data/outpatient-doc-acceptance-schema.ts`.
  The target already has a shared contract baseline in
  `packages/api-types/src/outpatient-doc-acceptance/index.ts`; it must be
  reconciled against the complete mounted closure before adding fields.
- Reference Persian translations are under `outpatientDocAcceptances` in
  `insurance-ui/src/locales/fa.json`; the target already contains a matching
  subtree in `apps/iap-admin/src/shared/i18n/locales/fa/common.json` and it
  must be compared key-by-key rather than retranslated.
- Reference enum presentation constants are in
  `insurance-ui/src/constants/outpatient-doc-acceptance-status-constant.ts`.
  The target currently keeps the status presentation in
  `apps/iap-admin/src/features/claim-reports/constants/outpatient-doc-acceptance-status.ts`;
  ownership must be chosen consistently with the final feature boundary.

## Implementation work items

1. **Complete:** Reconcile the complete API request/response schemas and service methods with
   `@iap/api-types`, using strict request schemas and loose response objects only
   where the reference retains unknown fields.
2. **Complete:** Add the feature model, query/service layer, route-search adapter, provider or
   store state, constants, and translation usage under the current architecture.
3. **Complete:** Port the reference table columns, toolbar/filter behavior, row actions,
   selection behavior, and all mounted dialogs with small page-owned components.
4. **Complete:** Replace the placeholder route with a thin composition route and preserve the
   generated route boundary.
5. **Complete:** Add focused schema, service request, URL-state, and visible behavior tests.
6. Run affected tests, typecheck, lint, and `git diff --check`; record evidence here.

## Current implementation evidence

- The placeholder route now composes a feature-owned page with typed route
  search validation.
- The page has URL-synchronised filters, server pagination, default `exId desc`
  ordering, loading/empty states, translated columns, status badges, refresh,
  Excel/PDF export actions, and claim-request navigation.
- The provider/store state slice is present under `context/provider` and
  `context/store`.
- The complete dialog/mutation closure remains outstanding.

## Verification

- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
- Full admin Vitest run reached existing translation parity failures because the
  reference path is not present relative to the worktree; rerun with
  `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`.

## Complete discrepancy checklist

The detailed file-by-file audits are recorded in:

- `docs/tasks/outpatient-ui-audit.md` — page composition, every mounted
  component, UI behavior, URL state, and side effects.
- `docs/tasks/outpatient-contract-audit.md` — API methods, request/response
  schemas, enum constants, and translation keys.

Implementation order:

1. **P0 contracts:** port the complete reference schema closure and all service
   methods, preserving endpoint paths, methods, payload mapping, optionality,
   and response parsing.
2. **P0 state:** port the provider/context and damage-case store into the
   feature `context/` ownership required by the target architecture.
3. **P0 page surface:** reconcile columns, toolbar, row actions, URL filters,
   selection, default sort, loading/error/empty behavior, and all page actions.
4. **P0 dialogs:** port acceptance form/view/generate/adjustment/send/cancel/
   terminate/delete/delete-method, claim form/view, issuance form/view, and
   damage-case dialog/table/form/view components.
5. **P1 localization/constants:** copy only mounted reference keys and exact
   Persian values; centralize status and websocket status presentation.
6. **P1 verification:** add contract, request mapping, URL-state, and focused
   component tests, then run typecheck, lint, affected tests, and diff checks.

The first three groups can be implemented in parallel once the contract names
are frozen; dialog work depends on the state and service groups.

## Audit status as of 2026-10-06

**Complete:** route replacement, typed route search, provider/store skeleton,
complete API contracts/service methods, page surface, toolbar, row actions,
refresh/export/actions, tests, and lint/typecheck.

**Complete:** acceptance dialog entry points are split into the nine reference
filenames, nested dialog entry points are present, and focused service/store/
route/constants tests pass.

Backend-live and pixel-perfect/browser verification are excluded from the task
acceptance criteria per the latest user decision.

## Verification update (2026-10-06)

Added focused tests for the implemented boundary:

- `apps/iap-admin/src/features/outpatient-doc-acceptances/route-adapters/table-search.test.ts`
- `apps/iap-admin/src/features/outpatient-doc-acceptances/route-adapters/route-search-schema.test.ts`
- `apps/iap-admin/src/features/outpatient-doc-acceptances/constants/outpatient-doc-acceptance-status.test.ts`

All three files pass together (6 tests). They verify URL-state round-tripping,
strict route validation, and exact reference status/WS-status enum ordering and
translation-key mapping. Mutation services, schemas, and dialog parity remain
open.
