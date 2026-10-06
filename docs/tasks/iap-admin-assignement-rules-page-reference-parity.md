# iap-admin assignment rules page parity

## Scope

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/assignement-rules/index.tsx`
- Reference entry point: `insurance-ui/src/routes/_authenticated/assignement-rules/index.tsx`
- Reference page: `insurance-ui/src/features/assignement-rules/pages/assignement-rules-page.tsx`
- Reference source of truth: the mounted assignment rules page closure, including API contracts, Zod schemas, Persian translation values, table state, dialogs, mutation sequencing, and row actions.

## Verified gaps in the target

The target currently renders only `PlaceholderPage` for `/assignement-rules/`. Its reusable table, filter, dialog, form, query, API-client, and localization infrastructure already exists. The following page-scoped components do not exist and must be implemented:

1. Data contracts in `@iap/api-types/src/assignement-rule/`.
2. Localization dictionary keys under `assignementRules` in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
3. Enum translation and badge color constants in `features/assignement-rules/constants/assignement-rule-constant.ts`.
4. Feature service, query hooks, and client UI store in `features/assignement-rules/`.
5. Route search schema and table search adapter in `features/assignement-rules/route-adapters/`.
6. Table columns and row actions in `features/assignement-rules/components/`.
7. Toolbar with text, number range, date range, and faceted filters.
8. Form dialog, doc type select field, and agreement policy select field.
9. Delete and bulk delete confirmation dialogs.
10. Page composition component and thin router route entry.

## Tasks

Detailed component-by-component task files are documented in `docs/tasks/assignement-rules/`:
- `assignement-rules/TASK-01-API-CONTRACTS-AND-SCHEMAS.md`
- `assignement-rules/TASK-02-LOCALIZATION-AND-CONSTANTS.md`
- `assignement-rules/TASK-03-SERVICE-AND-QUERIES.md`
- `assignement-rules/TASK-04-STORE-AND-STATE-MANAGEMENT.md`
- `assignement-rules/TASK-05-ROUTE-ADAPTERS-AND-SEARCH-STATE.md`
- `assignement-rules/TASK-06-TABLE-COLUMNS-AND-ACTIONS.md`
- `assignement-rules/TASK-07-TOOLBAR-AND-FILTERS.md`
- `assignement-rules/TASK-08-FORM-AND-SUPPORTING-FIELDS.md`
- `assignement-rules/TASK-09-CONFIRM-AND-DELETE-DIALOGS.md`
- `assignement-rules/TASK-10-PAGE-AND-ROUTER-INTEGRATION.md`
- `assignement-rules/TASK-11-TESTING-AND-VALIDATION.md`

## Architecture decisions

- The route stays a composition boundary and imports only the feature public API.
- Contracts belong in `@iap/api-types`; transport behavior stays in the feature service.
- The target shared table, filter, dialog, form, and UI primitives replace reference-local equivalents when their responsibility matches.
- Centralized enum constant maps status (`ACTIVE` / `INACTIVE`) to translation keys and styling classes.
