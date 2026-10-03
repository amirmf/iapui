# Person Special Diseases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the iap-admin placeholder route with the verified person-special-diseases management page from the reference.

**Architecture:** The authenticated route composes a feature-owned `PersonSpecialDiseasesPage`. The feature owns URL/table state, dialog/selection state, and page UI; API contracts and transport remain in the existing reusable person-special-diseases module. The enum presentation mapping moves to that module's public API because it has two feature consumers.

**Tech Stack:** React 19, TypeScript, TanStack Router/Table/Query, Zustand, React Hook Form, Zod v4, i18next, Vitest, iap workspace UI packages.

**Spec:** `docs/tasks/iap-admin-person-special-diseases-reference-parity.md`

## Global Constraints

- Preserve the source-verified names and behavior of the mounted reference component closure.
- Keep routes thin; feature UI and local state live under `apps/iap-admin/src/features/person-special-diseases`.
- Use only public APIs between features and modules; no cross-feature internal imports.
- Use existing strict Zod v4 contracts and validated `@modules/person-special-diseases` service; do not duplicate contracts.
- Use `cn` for conditional classes and existing `@iap/ui`, `@iap/forms`, `@iap/dialogs`, and `@shared/tables` primitives.
- Copy existing Persian `personSpecialDiseases` values only; do not infer translations.

## Review Focus

- Empty or invalid `page`/`size` URL values fall back to the standard first page and size.
- The page preserves source-equivalent unsorted table behavior and does not add target-only sort state.
- Page changes clear the selected row set so destructive actions cannot target a different server page.
- A missing selected row or row identifier cannot issue a bulk/single delete request.
- The selected user remains visible when it is not in the active debounced search results.

### Task 1: URL state and reusable enum presentation mapping

**Files:**
- Create: `apps/iap-admin/src/features/person-special-diseases/model/person-special-disease-route-search-schema.ts`
- Create: `apps/iap-admin/src/features/person-special-diseases/model/person-special-disease-table-state.ts`
- Create: `apps/iap-admin/src/features/person-special-diseases/model/person-special-disease-table-state.test.ts`
- Create: `apps/iap-admin/src/modules/person-special-diseases/constants/special-disease-options.ts`
- Modify: `apps/iap-admin/src/modules/person-special-diseases/index.ts`
- Modify: `apps/iap-admin/src/features/user-account/constants/special-disease-options.ts`
- Modify: `apps/iap-admin/src/features/user-account/ui/user-account-special-disease-form.tsx`

**Interfaces:**
- Produces: `personSpecialDiseaseRouteSearchSchema`, `parsePersonSpecialDiseaseTableSearch`, `toPersonSpecialDiseaseTableSearch`, `toPersonSpecialDiseaseApiFilters`, `getSpecialDiseaseOptions`, `specialDiseaseColors`, and `specialDiseaseTranslationKeys`.

- [x] Write failing table-state tests for defaults, filter preservation, serialised pagination, and invalid URL values.
- [x] Run the focused test file and confirm it fails because the state module is absent.
- [x] Implement the strict route schema, pure table adapter, and module public enum mapping; update the user-account form to consume the module public API.
- [x] Run the focused test file and confirm it passes.

### Task 2: Feature UI primitives and dialogs

**Files:**
- Create: `apps/iap-admin/src/features/person-special-diseases/model/store/person-special-disease-store.ts`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-columns.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-row-actions.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-user-search-select.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-form-dialog.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-delete-dialog.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/components/person-special-disease-bulk-delete-dialog.tsx`
- Create: focused component tests colocated with the relevant owner.

**Interfaces:**
- Consumes: Task 1's mapping functions and the existing public `personSpecialDiseaseService`.
- Produces: `usePersonSpecialDiseaseColumns`, `PersonSpecialDiseaseRowActions`, `PersonSpecialDiseaseUserSearchSelect`, `PersonSpecialDiseaseFormDialog`, `PersonSpecialDiseaseDeleteDialog`, and `PersonSpecialDiseaseBulkDeleteDialog`.

- [x] Write failing tests for form validation, dialog mutation sequencing, selected-row identifier extraction, and no-selection deletion guard.
- [x] Run the focused tests and confirm expected failures before production code exists.
- [x] Implement small source-equivalent components with target primitives, target user-account selection module, and accessible labels/pending states.
- [x] Run the focused tests and confirm they pass.

### Task 3: Page composition and authenticated route

**Files:**
- Create: `apps/iap-admin/src/features/person-special-diseases/person-special-diseases-page.tsx`
- Create: `apps/iap-admin/src/features/person-special-diseases/index.ts`
- Create: `apps/iap-admin/src/features/person-special-diseases/person-special-diseases-page.test.tsx`
- Modify: `apps/iap-admin/src/app/router/routes/_authenticated/person-special-diseases/index.tsx`

**Interfaces:**
- Consumes: Tasks 1-2's route state, store, columns, and dialogs.
- Produces: thin route composition of `PersonSpecialDiseasesPage` with source-equivalent loader crumb and validated search.

- [x] Write a failing page/route test for the title, query request state, selection reset after pagination, and toolbar actions.
- [x] Run the focused test and confirm it fails with the placeholder route/page absent.
- [x] Implement controlled server query, controlled table state, toolbar, dialogs, feature export, and thin route composition.
- [x] Run the focused test and confirm it passes.

### Task 4: Integration verification and task-document evidence

**Files:**
- Modify: `docs/tasks/iap-admin-person-special-diseases-reference-parity.md`

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: verified completion evidence and checked task list.

- [x] Run the affected feature/module tests, iap-admin typecheck, lint, build, and `git diff --check`.
- [x] Record actual commands/results in the task document; mark only evidence-backed tasks complete.
