# Pipelines Page Parity & Implementation Tasks

This directory contains the detailed, component-by-component implementation plan and task specifications for the `/pipelines/` page in `iap-admin`, ported with complete fidelity from the reference project `insurance-ui`.

## Source of Truth
- **Reference Route:** `insurance-ui/src/routes/_authenticated/pipelines/index.tsx`
- **Reference Feature:** `insurance-ui/src/features/pipelines/`
- **Target Route:** `apps/iap-admin/src/app/router/routes/_authenticated/pipelines/index.tsx`
- **Target Feature:** `apps/iap-admin/src/features/pipelines/`
- **API Contracts:** `packages/api-types/src/pipeline/index.ts` re-exported in `packages/api-types/src/index.ts`
- **Branch / Worktree:** `codex/pipelines` at `/home/sadegh/Android/project/iap-ui-pipelines` (branched from `main`)

## Architecture & Conventions Alignment
- **Single-root-route Exception:** As documented in `APPLICATION-ARCHITECTURE.md`, `/pipelines/` is a single root route without sub-pages; the page component lives directly at `features/pipelines/pipelines-page.tsx`, and exclusive UI components live under `features/pipelines/components/`.
- **Thin Route:** The route file only declares the file route, sets `loader: () => ({ crumb: 'pipelines' })`, and delegates rendering to `PipelinesPage` imported through the feature's public barrel `features/pipelines/index.ts`.
- **API Contracts in `@iap/api-types`:** Zod v4 schemas and inferred TypeScript types live in `packages/api-types/src/pipeline/index.ts`. No raw handwritten interfaces or duplicate types.
- **Service via `@iap/api-client`:** Service calls use `getApiClient()` from `@iap/api-client` and validate inputs/outputs against the Zod schemas.
- **Server State in TanStack Query:** Server cache and mutations live in `queries/use-pipelines.ts`.
- **Compact & Performant Components:** Tables and interactive controls are broken down into small, focused sub-components with memoized cell renderers to prevent unnecessary re-renders.
- **Shared Primitives:** Leverages `@shared/components/layout/main` for `Main`, `@shared/tables` for `SimpleDataTable` and `DataTableColumnHeader`, `@iap/dialogs` for `ConfirmDialog` with `presentation='reference'`, and `sonner` for toast notifications.

## Task Breakdown & Execution Plan

| Task ID | Document | Scope & Responsibilities | Parallelizable With | Status |
| --- | --- | --- | --- | --- |
| **TASK-01** | [TASK-01-API-CONTRACTS-AND-SCHEMAS.md](./TASK-01-API-CONTRACTS-AND-SCHEMAS.md) | Zod v4 schemas & types in `@iap/api-types` | TASK-02 | Completed |
| **TASK-02** | [TASK-02-LOCALIZATION-AND-CONSTANTS.md](./TASK-02-LOCALIZATION-AND-CONSTANTS.md) | Translations in `common.json` & status/badge helpers in `constants/` | TASK-01 | Completed |
| **TASK-03** | [TASK-03-SERVICE-AND-QUERIES.md](./TASK-03-SERVICE-AND-QUERIES.md) | HTTP service & TanStack Query hooks | - | Completed |
| **TASK-04** | [TASK-04-PIPELINE-JOBS-TABLE.md](./TASK-04-PIPELINE-JOBS-TABLE.md) | Jobs list table, selection state, and start job action | TASK-05 | Completed |
| **TASK-05** | [TASK-05-PIPELINE-EXECUTIONS-TABLE.md](./TASK-05-PIPELINE-EXECUTIONS-TABLE.md) | Executions table, details accordion, and stop/restart actions | TASK-04 | Completed |
| **TASK-06** | [TASK-06-STOP-CONFIRM-DIALOG.md](./TASK-06-STOP-CONFIRM-DIALOG.md) | Destructive stop confirmation modal dialog | TASK-04, TASK-05 | Completed |
| **TASK-07** | [TASK-07-PAGE-COMPOSITION-AND-ROUTE.md](./TASK-07-PAGE-COMPOSITION-AND-ROUTE.md) | Main page layout, header, mutations orchestration, and route wiring | - | Completed |
| **TASK-08** | [TASK-08-TESTING-AND-VALIDATION.md](./TASK-08-TESTING-AND-VALIDATION.md) | Unit tests, contract verification, typecheck, lint, and build | - | Completed |
| **PARITY** | [PARITY-AUDIT-DISCREPANCIES.md](./PARITY-AUDIT-DISCREPANCIES.md) | Complete audit matrix of 10 discrepancies vs `insurance-ui` | - | Completed |
| **TASK-09** | [TASK-09-PARITY-FILE-STRUCTURE-AND-HOOKS.md](./TASK-09-PARITY-FILE-STRUCTURE-AND-HOOKS.md) | Canonical `pages/pipelines-page.tsx`, `data/pipeline-schema.ts`, `hooks/use-pipelines.ts` | TASK-10 | Completed |
| **TASK-10** | [TASK-10-PARITY-TABLE-ACTION-BUTTON-AND-DATATABLE.md](./TASK-10-PARITY-TABLE-ACTION-BUTTON-AND-DATATABLE.md) | Support `info` variant on TableActionButton & direct text props on SimpleDataTable | TASK-09 | Completed |
| **TASK-11** | [TASK-11-PARITY-PIPELINES-PAGE-AND-CONFIRM-DIALOG.md](./TASK-11-PARITY-PIPELINES-PAGE-AND-CONFIRM-DIALOG.md) | Exact ConfirmDialog adapter & direct service mutation bindings | TASK-12 | Completed |
| **TASK-12** | [TASK-12-PARITY-TABLES-AND-PRESENTATION.md](./TASK-12-PARITY-TABLES-AND-PRESENTATION.md) | Reference column headers, max-h-[34rem], badge & action button presentation | TASK-11 | Completed |

## Dependency Graph

```text
[TASK-01: API Contracts] ──┬──> [TASK-03: Service & Queries] ──┬──> [TASK-04: Jobs Table] ────────┬──> [TASK-07: Page Composition & Route] ──> [TASK-08: Validation]
                           │                                   │                                  │
[TASK-02: i18n & Constant]─┴───────────────────────────────────┼──> [TASK-05: Executions Table] ──┤
                                                               │                                  │
                                                               └──> [TASK-06: Stop Dialog] ───────┘
```
