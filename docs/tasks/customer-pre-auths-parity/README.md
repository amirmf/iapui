# Customer Pre-Authorizations (`/pre-auths/`) Parity — Implementation Tasks

- **Target Route**: `/pre-auths/` in `apps/iap-app` (`apps/iap-app/src/app/router/routes/_authenticated/pre-auths/index.tsx`)
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/pre-auths/index.tsx`
- **Reference Page**: `insurance-ui/src/features/my-iap/pre-auths/pages/pre-auths-page.tsx`
- **Worktree**: `.worktrees/pre-auths` (branch `codex/pre-auths`) branched from `main`
- **Architecture**: `docs/architecture/APPLICATION-ARCHITECTURE.md`, `customer-portal-app` skill
- **Status**: **COMPLETED** (Verified with unit tests, typecheck, lint, architecture check, and production build)

---

## Task Index

1. [Task 01 — API Types and Contracts (COMPLETED)](TASK-01-API-TYPES-AND-CONTRACTS.md)
2. [Task 02 — Insurance Policy & Sub-Insured People Modules/Services (COMPLETED)](TASK-02-MODULES-AND-SERVICES.md)
3. [Task 03 — Pre-Auth Service, Queries, and Status Constants (COMPLETED)](TASK-03-QUERIES-AND-CONSTANTS.md)
4. [Task 04 — Header, Filter, Card, and Pagination Components (COMPLETED)](TASK-04-COMPONENTS-AND-FILTERS.md)
5. [Task 05 — Page Component, Route Wiring, and Translations (COMPLETED)](TASK-05-PAGE-ROUTE-AND-TRANSLATIONS.md)
6. [Task 06 — Verification, Unit Tests, and Build Checks (COMPLETED)](TASK-06-TESTS-AND-VERIFICATION.md)
7. [Task 07 — Exact Component-by-Component Parity Audit & Implementation (COMPLETED)](TASK-07-EXACT-COMPONENT-PARITY-AUDIT.md)

---

## Component & Asset Inventory

| Reference (`insurance-ui`) | Target (`iap-ui`) | Purpose | Status |
| --- | --- | --- | --- |
| `src/routes/_app/myiap/pre-auths/index.tsx` | `apps/iap-app/src/app/router/routes/_authenticated/pre-auths/index.tsx` | Thin TanStack file route with `crumb: 'preAuths'` delegating to `PreAuthsPage` | Verified |
| `src/features/my-iap/pre-auths/pages/pre-auths-page.tsx` | `apps/iap-app/src/features/pre-auths/pages/index/pre-auths-page.tsx` | Pre-authorizations page orchestrating filter, dual pagination, card grid, retreat dialog | Verified |
| `src/features/my-iap/claim-requests/components/my-claim-request-page-header.tsx` | `apps/iap-app/src/features/pre-auths/components/my-claim-request-page-header.tsx` | Page title, description, and refetch action button | Verified |
| `src/features/my-iap/pre-auths/components/pre-auth-filter.tsx` | `apps/iap-app/src/features/pre-auths/components/pre-auth-filter.tsx` | Policy & sub-insured national code filter form using react-hook-form | Verified |
| `src/features/my-iap/pre-auths/components/pre-auth-card.tsx` | `apps/iap-app/src/features/pre-auths/components/pre-auth-card.tsx` | Card displaying voucher code, illness, status badge, amounts, dates | Verified |
| `src/components/pagination.tsx` | `apps/iap-app/src/features/pre-auths/components/pagination.tsx` | Previous/Next pagination bar with count text | Verified |
| `src/constants/pre-auth-status-constant.ts` | `apps/iap-app/src/features/pre-auths/constants/pre-auth-status-constant.ts` | Status codes (101, 102, 103), color mappings, border styles, translation keys | Verified |
| `src/features/my-iap/pre-auths/hooks/use-pre-auths.ts` | `apps/iap-app/src/features/pre-auths/queries/use-pre-auths.ts` | TanStack Query hook `usePreAuths` with queryKey `['my-iap-pre-auths', 'list', request]` | Verified |
| `src/features/my-iap/pre-auths/services/pre-auth-service.ts` | `apps/iap-app/src/features/pre-auths/services/pre-auth-service.ts` | Axios client service calling `GET /my/iap/pre-auths/page-full` | Verified |
| `src/features/my-iap/pre-auths/data/pre-auth-schema.ts` | `packages/api-types/src/pre-auths/index.ts` | Strict Zod v4 request and loose response schemas matching `openapidoc.json` | Verified |
| `src/locales/fa.json` (`myiap.preAuths`) | `apps/iap-app/src/shared/i18n/locales/fa/common.json` | Persian translation bundle | Verified |
