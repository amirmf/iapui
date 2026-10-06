# Assignment Rules Parity & Implementation Tasks

This directory contains the component-by-component implementation breakdown for `/assignement-rules/` in `iap-admin`, ported from reference implementation `insurance-ui`.

## Source of Truth
- **Reference Route:** `insurance-ui/src/routes/_authenticated/assignement-rules/index.tsx`
- **Reference Feature:** `insurance-ui/src/features/assignement-rules/`
- **Target Route:** `apps/iap-admin/src/app/router/routes/_authenticated/assignement-rules/index.tsx`
- **Target Feature:** `apps/iap-admin/src/features/assignement-rules/`

## Task Breakdown & Execution Plan

| Task ID | Document | Scope & Responsibilities | Parallelizable With | Status |
| --- | --- | --- | --- | --- |
| **TASK-01** | [TASK-01-API-CONTRACTS-AND-SCHEMAS.md](./TASK-01-API-CONTRACTS-AND-SCHEMAS.md) | Zod v4 schemas & types in `@iap/api-types` | TASK-02 | Completed |
| **TASK-02** | [TASK-02-LOCALIZATION-AND-CONSTANTS.md](./TASK-02-LOCALIZATION-AND-CONSTANTS.md) | Translations in `common.json` & enum constant in `constants/` | TASK-01 | Completed |
| **TASK-03** | [TASK-03-SERVICE-AND-QUERIES.md](./TASK-03-SERVICE-AND-QUERIES.md) | HTTP service & TanStack Query hooks | - | Completed |
| **TASK-04** | [TASK-04-STORE-AND-STATE-MANAGEMENT.md](./TASK-04-STORE-AND-STATE-MANAGEMENT.md) | UI state (dialogs, selection) in `context/store/` | TASK-05 | Completed |
| **TASK-05** | [TASK-05-ROUTE-ADAPTERS-AND-SEARCH-STATE.md](./TASK-05-ROUTE-ADAPTERS-AND-SEARCH-STATE.md) | Route search schema & table filter serialization | TASK-04 | Completed |
| **TASK-06** | [TASK-06-TABLE-COLUMNS-AND-ACTIONS.md](./TASK-06-TABLE-COLUMNS-AND-ACTIONS.md) | TanStack Table column definitions & row actions | - | Completed |
| **TASK-07** | [TASK-07-TOOLBAR-AND-FILTERS.md](./TASK-07-TOOLBAR-AND-FILTERS.md) | Toolbar with text, number-range, date, and faceted filters | - | Completed |
| **TASK-08** | [TASK-08-FORM-AND-SUPPORTING-FIELDS.md](./TASK-08-FORM-AND-SUPPORTING-FIELDS.md) | Form schema, form dialog, doc type select, policy select | - | Completed |
| **TASK-09** | [TASK-09-CONFIRM-AND-DELETE-DIALOGS.md](./TASK-09-CONFIRM-AND-DELETE-DIALOGS.md) | Single delete dialog & bulk delete dialog | - | Completed |
| **TASK-10** | [TASK-10-PAGE-AND-ROUTER-INTEGRATION.md](./TASK-10-PAGE-AND-ROUTER-INTEGRATION.md) | Page composition, feature barrel export & route replacement | - | Completed |
| **TASK-11** | [TASK-11-TESTING-AND-VALIDATION.md](./TASK-11-TESTING-AND-VALIDATION.md) | Unit tests, contract verification, lint, typecheck, build | - | Completed |

## Dependency Graph

```text
[TASK-01: API Contracts] ──┬──> [TASK-03: Service & Queries] ──┬──> [TASK-08: Form Dialog] ────────┬──> [TASK-10: Page Integration] ──> [TASK-11: Testing & Validation]
                           │                                   │                                   │
[TASK-02: i18n & Constant]─┼──> [TASK-06: Columns & Actions] ─┼──> [TASK-09: Delete Dialogs] ─────┤
                           │                                   │                                   │
[TASK-04: UI Store] ───────┼──> [TASK-07: Toolbar & Filters] ──┴───────────────────────────────────┘
                           │
[TASK-05: Route Adapters] ─┘
```

## Architecture reconciliation (2026-10-06)

The feature uses the single-root-route exception in the application architecture.
Its page lives at `assignement-rules-page.tsx`, with page-exclusive UI under
`components/`. The route consumes the feature's public `index.ts`.

The implementation owns responsibilities at their actual locations, rather than
re-exporting legacy implementations from correctly named wrapper files:

- `context/store/`: Zustand state and the selected-row ID helper with its tests.
- `context/provider/`: page-unmount store cleanup.
- `model/`: the translated form schema and inferred form type.
- `queries/`: page data, document-type and agreement lookups, and mutation hooks.
- `route-adapters/`: search contracts and pagination navigation.
- `components/`: header actions, form fields, form value conversion, table and dialogs.
- `services/`: API calls, UUID validation, payload serialization and response parsing.

The shared request schema is strict and rejects undeclared fields. Standard
mutation failures use the application Query Client error handler. Success
callbacks retain the existing refetch and dialog cleanup behavior. Refresh uses
`isFetching` so a manual refresh also disables the button and shows progress.

See [the reusable review checklist](../../architecture/FEATURE-ARCHITECTURE-REVIEW.md)
when reviewing other pages. Existing project skills cover the implementation
patterns; this reconciliation does not introduce an additional skill.

### Verified scope

The final implementation passed all 146 admin test files (387 tests), admin and
API-contract type checking, feature ESLint, formatting, architecture checks and
the admin production build. Tests that read the external reference repository
require `INSURANCE_UI_REFERENCE_PATH` to point to the local `insurance-ui` root.
The architecture refactor did not perform a new browser parity review or add
the planned form-dialog integration suite; those historical task acceptance
items should not be interpreted as newly verified.
