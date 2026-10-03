# Repetitive Responses Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Completion record (2026-10-03):** All seven implementation tasks and final
> verification are complete. The unchecked entries below are the preserved
> original TDD execution checklist, not outstanding work; implementation
> evidence is recorded in `docs/tasks/iap-admin-repetitive-responses-page-parity.md`
> and `docs/tasks/iap-admin-repetitive-responses-reference-parity-v2.md`.

**Goal:** Add the iap-admin `/repetitive-responses/` page with reference-identical response-group and repetitive-response management behavior.

**Architecture:** Keep the authenticated route as a composition boundary. Own screen behavior in `features/repetitive-responses`, retain source component export names, validate every API boundary with public Zod contracts in `@iap/api-types`, and use target shared table/dialog/form primitives.

**Tech Stack:** React 19, TypeScript, TanStack Router/Query/Table, React Hook Form, Zod v4, Zustand, i18next, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-03-iap-admin-repetitive-responses-design.md`

## Global Constraints

- Preserve source component export names and source-backed API method/path/payload behavior.
- Use application aliases, `@iap/ui` primitives, and `cn`; do not import package internals.
- Keep route files thin; page-exclusive UI belongs under `features/repetitive-responses/pages/index/components/`.
- Validate strict requests and parsed responses at API boundaries with Zod v4; response objects that retain extra backend properties use `.loose()`.
- Server state belongs to TanStack Query and only dialog/selection state belongs to the feature Zustand store.
- Persian text must be copied verbatim from the two mounted reference namespaces; do not translate or invent values.
- Use TDD: every production unit starts with a focused test observed to fail, then the smallest implementation that passes it.

## Review Focus

- A malformed or incomplete paginated response must fail at the service boundary rather than reach the table.
- A selected row without an `id` must never issue a delete request.
- Changing a group must invalidate group-dependent response UI as well as its own list when the reference behavior requires refresh.
- A form submitted while its mutation is pending must remain semantically disabled and make only one request.
- Filter/search state must not leak UI-only keys into serialized API query parameters.

## Parallelization schedule

Tasks 1 and 2 share no production files and run in parallel. Tasks 3 and 4
depend on Task 1. Tasks 5 and 6 depend on Tasks 3 and 4, respectively, and
can run in parallel because they own separate `groups/` and `responses/`
component directories. Task 7 integrates the completed public exports.

### Task 1: Public contracts and validated services

**Files:**
- Create: `packages/api-types/src/repetitive-responses/index.ts`
- Modify: `packages/api-types/src/index.ts`
- Create: `apps/iap-admin/src/features/repetitive-responses/services/repetitive-response-service.ts`
- Create: `apps/iap-admin/src/features/repetitive-responses/services/repetitive-response-group-service.ts`
- Test: `apps/iap-admin/src/features/repetitive-responses/services/repetitive-response-service.test.ts`
- Test: `apps/iap-admin/src/features/repetitive-responses/services/repetitive-response-group-service.test.ts`

**Interfaces:**
- Produces: `RepetitiveResponse`, `RepetitiveResponseGroup`, page/request schemas, `repetitiveResponseService`, and `repetitiveResponseGroupService`.
- Consumes: `createPageRequestSchema`, `createPageResponseSchema`, `getApiClient`, and `transformApiFilterParams`.

- [ ] Write failing contract/service tests covering response and group pagination defaults, invalid response rejection, `POST`/`PATCH` response mutations, `POST`/`PUT` group mutations, and every source delete endpoint.
- [ ] Run the two test files and confirm failure is caused by missing public contracts/services.
- [ ] Add source-field contracts and strict request wrapper schemas; add services that parse outgoing input and inbound data, serialize only API filters, and preserve the reference endpoints/methods/default sizes.
- [ ] Re-run the two test files and confirm they pass.
- [ ] Commit the contracts and services.

### Task 2: Translation closure and route boundary

**Files:**
- Modify: `apps/iap-admin/src/shared/i18n/locales/fa/common.json`
- Create: `apps/iap-admin/src/features/repetitive-responses/model/repetitive-response-translations.test.ts`
- Modify: `apps/iap-admin/src/app/router/routes/_authenticated/repetitive-responses/index.tsx`

**Interfaces:**
- Produces: exact `repetitiveResponses` and `repetitiveResponseGroups` translation namespaces and a thin route that imports `RepetitiveResponsesPage` from the feature public API.
- Consumes: no Task 1 interface; this task is independent.

- [ ] Write the failing locale parity test that reads the local reference Persian locale through `INSURANCE_UI_REFERENCE_PATH` and compares only the two mounted namespaces.
- [ ] Run that test and confirm failure is caused by missing target locale values.
- [ ] Copy the exact namespaces; change the existing placeholder route to the source-equivalent thin composition while leaving its final component import unresolved until Task 7.
- [ ] Re-run the locale test with `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui` and confirm it passes.
- [ ] Commit the locale and route work.

### Task 3: Feature model and response-group workflow

**Files:**
- Create: `apps/iap-admin/src/features/repetitive-responses/model/repetitive-response-store.ts`
- Create: `apps/iap-admin/src/features/repetitive-responses/model/repetitive-response-form-schema.ts`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-groups.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-columns.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-data-table-toolbar.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-row-actions.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-form-dialog.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-view-dialog.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-delete-method-dialog.tsx`
- Test: `apps/iap-admin/src/features/repetitive-responses/model/repetitive-response-store.test.ts`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-group-row-actions.test.tsx`

**Interfaces:**
- Consumes: group schemas/services from Task 1 and translations from Task 2.
- Produces: source-named group table and dialog components plus `useRepetitiveResponseGroup` state interface for Task 5 and page composition.

- [ ] Write failing store and group-action tests for opening/clearing dialog state, selected row behavior, and disabled/pending action semantics.
- [ ] Run these tests and confirm failure is caused by missing model/UI.
- [ ] Implement the source-named store/provider hooks, group query/table/filter state, columns, row actions, CRUD/view/delete dialogs, and targeted cache invalidation.
- [ ] Re-run the focused tests and confirm they pass.
- [ ] Commit the group workflow.

### Task 4: Response workflow and suggestion textarea

**Files:**
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-responses-section.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-columns.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-data-table-toolbar.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-row-actions.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-form-dialog.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-textarea.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-view-dialog.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-delete-method-dialog.tsx`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-textarea.test.tsx`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-response-row-actions.test.tsx`

**Interfaces:**
- Consumes: Task 1 response/group schemas and services, Task 2 translations, and Task 3 store/form schema exports.
- Produces: all source-named response workflow components for Task 7.

- [ ] Write failing tests for the debounced three-character suggestion threshold, row-action state transition, and pending submit guard.
- [ ] Run the focused tests and confirm failure is caused by missing UI.
- [ ] Implement response query/table/filter state, columns/actions, form/view/delete dialogs, and `RepetitiveResponseTextarea` with the source defaults: minimum query length 3, debounce 700ms, and at most 20 suggestions.
- [ ] Re-run the focused tests and confirm they pass.
- [ ] Commit the response workflow.

### Task 5: Response-group parity review and integration test

**Files:**
- Modify: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/*`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/groups/repetitive-response-groups.test.tsx`

**Interfaces:**
- Consumes: Task 3 group components.
- Produces: verified group-screen behavior ready for Task 7.

- [ ] Write an integration test for group filter/reset, refresh, selection-to-delete mapping, and mutation invalidation.
- [ ] Run it and confirm it fails for an observable behavior gap.
- [ ] Implement only the minimum correction needed for parity.
- [ ] Re-run the test and confirm it passes.
- [ ] Commit the verified group integration work.

### Task 6: Response parity review and integration test

**Files:**
- Modify: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/*`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/components/responses/repetitive-responses-section.test.tsx`

**Interfaces:**
- Consumes: Task 4 response components.
- Produces: verified response-screen behavior ready for Task 7.

- [ ] Write an integration test for response filter/reset, refresh, selection-to-delete mapping, and mutation invalidation.
- [ ] Run it and confirm it fails for an observable behavior gap.
- [ ] Implement only the minimum correction needed for parity.
- [ ] Re-run the test and confirm it passes.
- [ ] Commit the verified response integration work.

### Task 7: Page composition, public API, and final task record

**Files:**
- Create: `apps/iap-admin/src/features/repetitive-responses/pages/index/repetitive-responses-page.tsx`
- Create: `apps/iap-admin/src/features/repetitive-responses/index.ts`
- Modify: `apps/iap-admin/src/app/router/routes/_authenticated/repetitive-responses/index.tsx`
- Modify: `docs/tasks/iap-admin-repetitive-responses-page-parity.md`
- Test: `apps/iap-admin/src/features/repetitive-responses/pages/index/repetitive-responses-page.test.tsx`

**Interfaces:**
- Consumes: Tasks 2, 5, and 6 public exports.
- Produces: `RepetitiveResponsesPage` as the feature public API and the final evidence record.

- [ ] Write the failing page-composition test asserting group table precedes response table and provider cleanup resets feature state on unmount.
- [ ] Run it and confirm failure is caused by missing public page composition.
- [ ] Compose `RepetitiveResponsesPage`, export it publicly, resolve the thin route import, and update the task record with verified implementation evidence.
- [ ] Run the focused feature test suite with `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui` and confirm it passes.
- [ ] Commit composition and documentation.

## Final verification

- [ ] Run `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test`.
- [ ] Run `pnpm --filter iap-admin typecheck` and `pnpm --filter iap-admin lint`.
- [ ] Run `git diff --check` and update the task record with actual command results.
