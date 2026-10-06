# Sub Users Parity & Implementation Tasks

This directory defines the component-by-component implementation breakdown for `/sub-users/` in `iap-admin`, ported from reference implementation `insurance-ui`.

## Source of Truth
- **Reference Route:** `insurance-ui/src/routes/_authenticated/sub-users/index.tsx`
- **Reference Feature:** `insurance-ui/src/features/sub-users/`
- **Reference Constants:** `insurance-ui/src/constants/party-constant.ts`
- **Reference Translations:** `insurance-ui/src/locales/fa.json` (`subUsers.*`, `parties.role.*`)
- **Reference OpenAPI:** `insurance-ui/openapidoc.json` (`/api/auth/sub-users/**`, `/api/claim-requests/assignments/release`)
- **Target Route:** `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`
- **Target Feature:** `apps/iap-admin/src/features/sub-users/`
- **Target Contracts:** `packages/api-types/src/sub-user/`

## Component & Structure Mapping

| Reference Component / File | Target Component / File | Architecture Role |
| --- | --- | --- |
| `src/features/sub-users/data/sub-user-schema.ts` | `packages/api-types/src/sub-user/index.ts` & `features/sub-users/model/` | API response schemas & form schema |
| `src/constants/party-constant.ts` (subset) | `features/sub-users/constants/sub-user-constant.ts` | Status & role translation keys, colors, options |
| `src/features/sub-users/services/sub-user-service.ts` | `features/sub-users/services/sub-user-service.ts` | Typed backend API calls with `@iap/api-client` |
| `src/features/sub-users/context/sub-user-context.tsx` | `features/sub-users/context/store/sub-user-store.ts` & `provider/` | Zustand UI store & cleanup provider |
| `src/features/sub-users/context/sub-users-agreements-context.tsx` | `features/sub-users/context/store/sub-users-agreements-store.ts` & `provider/` | Zustand agreement selection store & provider |
| `src/components/data-table/filter/use-sync-query-params-table-filter.ts` | `features/sub-users/route-adapters/route-search-schema.ts` | URL search params validation and sync |
| `src/features/sub-users/components/sub-user-columns.tsx` | `features/sub-users/components/sub-user-columns.tsx` | TanStack Table column definitions |
| `src/features/sub-users/components/sub-user-row-actions.tsx` | `features/sub-users/components/sub-user-row-actions.tsx` | Row actions: view, edit, release, toggle status |
| `src/features/sub-users/components/sub-users-data-table-toolbar.tsx` | `features/sub-users/components/sub-users-data-table-toolbar.tsx` | URL-synced search and faceted status filter |
| `src/features/sub-users/components/sub-user-section.tsx` | `features/sub-users/components/sub-user-section.tsx` | Left panel sub-users table composition |
| `src/features/sub-users/components/sub-users-agreements-columns.tsx` | `features/sub-users/components/sub-users-agreements-columns.tsx` | Right table agreement columns (two-line) |
| `src/features/sub-users/components/sub-users-agreements-data-table-toolbar.tsx` | `features/sub-users/components/sub-users-agreements-data-table-toolbar.tsx` | Local state table filter toolbar |
| `src/features/sub-users/components/sub-users-agreements-section.tsx` | `features/sub-users/components/sub-users-agreements-section.tsx` | Right panel agreements table composition |
| `src/features/sub-users/components/sub-users-agreement-party-section.tsx` | `features/sub-users/components/sub-users-agreement-party-section.tsx` | Bottom panel connecting selected rows |
| `src/features/sub-users/components/sub-user-details-dialog.tsx` | `features/sub-users/components/sub-user-details-dialog.tsx` | Readonly user view dialog |
| `src/features/sub-users/components/sub-user-form-dialog.tsx` | `features/sub-users/components/sub-user-form-dialog.tsx` | Create/edit dialog with MultiSelect |
| `src/features/sub-users/components/sub-user-release-assignments-dialog.tsx` | `features/sub-users/components/sub-user-release-assignments-dialog.tsx` | Confirm dialog for releasing cartable |
| `src/features/sub-users/pages/sub-users-page.tsx` | `features/sub-users/sub-users-page.tsx` | Single-root-route page composition |
| `src/routes/_authenticated/sub-users/index.tsx` | `app/router/routes/_authenticated/sub-users/index.tsx` | Thin TanStack Router entry point |

## Task Breakdown & Execution Plan

| Task ID | Document | Scope & Responsibilities | Parallelizable With | Status |
| --- | --- | --- | --- | --- |
| **TASK-01** | [TASK-01-API-CONTRACTS-AND-SCHEMAS.md](./TASK-01-API-CONTRACTS-AND-SCHEMAS.md) | Zod schemas & types in `@iap/api-types` | TASK-02 | Completed |
| **TASK-02** | [TASK-02-LOCALIZATION-AND-CONSTANTS.md](./TASK-02-LOCALIZATION-AND-CONSTANTS.md) | Translations in `common.json` & enum constants | TASK-01 | Completed |
| **TASK-03** | [TASK-03-SERVICE-AND-QUERIES.md](./TASK-03-SERVICE-AND-QUERIES.md) | API client service & TanStack Query hooks | - | Completed |
| **TASK-04** | [TASK-04-STORE-AND-STATE-MANAGEMENT.md](./TASK-04-STORE-AND-STATE-MANAGEMENT.md) | Zustand stores for sub-users and agreements | TASK-05 | Completed |
| **TASK-05** | [TASK-05-ROUTE-ADAPTERS-AND-SEARCH-STATE.md](./TASK-05-ROUTE-ADAPTERS-AND-SEARCH-STATE.md) | Route search schema & table filter serialization | TASK-04 | Completed |
| **TASK-06** | [TASK-06-SUB-USER-TABLE-COLUMNS-AND-ACTIONS.md](./TASK-06-SUB-USER-TABLE-COLUMNS-AND-ACTIONS.md) | TanStack Table column definitions & row actions | - | Completed |
| **TASK-07** | [TASK-07-SUB-USER-TOOLBAR-AND-FILTERS.md](./TASK-07-SUB-USER-TOOLBAR-AND-FILTERS.md) | Search toolbar with text and faceted filters | - | Completed |
| **TASK-08** | [TASK-08-SUB-USER-FORM-AND-DETAILS-DIALOGS.md](./TASK-08-SUB-USER-FORM-AND-DETAILS-DIALOGS.md) | Form schema, form dialog, details dialog | - | Completed |
| **TASK-09** | [TASK-09-RELEASE-ASSIGNMENTS-DIALOG.md](./TASK-09-RELEASE-ASSIGNMENTS-DIALOG.md) | Confirmation dialog for releasing cartable | - | Completed |
| **TASK-10** | [TASK-10-AGREEMENTS-SUB-SECTION.md](./TASK-10-AGREEMENTS-SUB-SECTION.md) | Right panel agreements table, toolbar & columns | - | Completed |
| **TASK-11** | [TASK-11-AGREEMENT-PARTY-SUB-SECTION.md](./TASK-11-AGREEMENT-PARTY-SUB-SECTION.md) | Bottom panel agreement party applications integration | - | Completed |
| **TASK-12** | [TASK-12-PAGE-AND-ROUTER-INTEGRATION.md](./TASK-12-PAGE-AND-ROUTER-INTEGRATION.md) | Page composition, barrel export & route replacement | - | Completed |
| **TASK-13** | [TASK-13-TESTING-AND-VERIFICATION.md](./TASK-13-TESTING-AND-VERIFICATION.md) | Unit tests, contract verification, lint, typecheck, build | - | Completed |

## Dependency Graph

```text
[TASK-01: API Contracts] ──┬──> [TASK-03: Service & Queries] ──┬──> [TASK-06: Columns & Actions] ──┬──> [TASK-12: Page Integration] ──> [TASK-13: Verification]
                           │                                   ├──> [TASK-07: Toolbar & Filters] ──┤
[TASK-02: i18n & Constants]─┤                                   ├──> [TASK-08: Form & Details] ────┤
                           │                                   ├──> [TASK-09: Release Dialog] ────┤
[TASK-04: UI Stores] ──────┼───────────────────────────────────┼──> [TASK-10: Agreements Table] ──┤
                           │                                   └──> [TASK-11: Agreement Party] ───┘
[TASK-05: Route Adapters] ─┘
```
