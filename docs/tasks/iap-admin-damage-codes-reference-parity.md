# Damage Codes reference-parity tasks

## Scope

Implement authenticated `/damage-codes/` in `iap-admin` from the verified
closure beginning at `insurance-ui/src/features/damage-codes/pages/damage-codes-page.tsx`.
Preserve reference UI, APIs, schemas, filters, dialogs, pricing behavior, and
Persian values. Adapt ownership to the target architecture; the route stays thin.

## Evidence

- Reference route: `insurance-ui/src/routes/_authenticated/damage-codes/index.tsx`.
- Reference closure: `features/damage-codes/**`,
  `features/damage-code-pricings/**`, `constants/damage-code-constant.ts`.
- Target route is only a `PlaceholderPage`.
- Reusable target capabilities already exist: `@shared/tables`, `@iap/forms`,
  `@iap/ui`, `@iap/dialogs`, `@iap/api-client`, `@iap/api-types`, and
  feature-local Zustand patterns.
- No target damage-code contract or service exists. No new shared UI primitive
  is required.

## Tasks

1. [x] Add strict request and loose response Zod v4 contracts to
   `@iap/api-types` for damage codes and damage-code pricings: page, detail,
   create/update, price lookup, soft delete, and bulk delete.
2. [x] Add target feature services using validated contracts, `getApiClient()`,
   abort signals, and `transformApiFilterParams`; preserve reference methods,
   paths, request placement, defaults, date serialization, and query keys.
3. [x] Add feature URL-table state, small Zustand dialog state, and focused
   tests for contracts and URL serialization.
4. [x] Add enum constants for status and pricing types: typed translation-key
   maps, options, and semantic badge classes. This is appropriate because both
   are stable API enums; display text remains in the Persian locale.
5. [x] Add the damage-code table: URL-synchronised code/title/extId/status/date
   filters, controlled pagination/sorting/selection, refresh, empty/loading
   states, super-admin bulk delete, and accessible row actions.
6. [x] Add create/edit, details, and soft-or-hard bulk-delete dialogs using
   target forms and dialogs. Keep form fields, defaults, validation, and mutation
   sequencing equivalent to the reference.
7. [x] Add pricing management: selected-code lower table, pricing filters,
   create/edit/details, row actions, and soft-or-hard bulk delete. Retain the
   reference price lookup API even where this page does not invoke it.
8. [x] Replace the placeholder with a thin route exporting the feature page and
   validated search schema; do not edit generated `routeTree.gen.ts` manually.
9. [x] Copy only reference-mounted `damageCodes` and `damageCodePricings` Persian
   translation values into `shared/i18n/locales/fa/common.json`.
10. [x] Run focused tests, formatting, lint, typecheck, build where feasible,
    `git diff --check`, then required code and security review. Record evidence.

## Decisions

- `features/damage-codes/pages/index/components/` owns this page-exclusive UI;
  `model/`, `services/`, and `constants/` stay feature-local.
- Server state stays in TanStack Query. Zustand owns only dialogs, selected row,
  and selection workflow.
- The reference uses deprecated Zod v3 `.passthrough()`; target response schemas
  use Zod v4 `.loose()` as required by target architecture.
- Existing `/doc-types` is an inspected target precedent for tables, state,
  schemas, services, and translations. It is outside this page's behavior scope
  and will not be changed without a concrete reference discrepancy.

## Completion criteria

- Every mounted reference interaction has a source-backed target equivalent.
- Contracts reject invalid requests and validate response boundaries.
- Page is usable by keyboard, controls expose accessible names, and all visible
  strings use i18n.
- No duplicate shared primitive, unrelated change, or generated-file edit.

## Validation

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test`: 93 passed.
- `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin typecheck`, and
  `pnpm --filter iap-admin build`: passed. Build emits existing Zod PURE-comment
  and chunk-size warnings only.
- `pnpm audit --prod --json`: 0 vulnerabilities.
- `git diff --check`: passed.
