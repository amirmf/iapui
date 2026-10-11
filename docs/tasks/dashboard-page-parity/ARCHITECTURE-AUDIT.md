# Architecture Compliance Audit — Dashboard Feature

Review against `docs/architecture/APPLICATION-ARCHITECTURE.md` and repository standards.

## 1. Page placement & single-root-route rule
- **Rule**: A feature owning only a root route without sibling page journeys places the page component directly in the feature root (`features/<feature>/<feature>-page.tsx`), keeping page-exclusive components in `features/<feature>/components/`.
- **Status**: Compliant. `apps/iap-admin/src/features/dashboard/dashboard-page.tsx` lives directly in feature root, while all 5 report tables, header, and toolbar live in `components/`.

## 2. Route adapters boundary (`route-adapters/`)
- **Rule**: Integration with TanStack Router (search schemas, URL filters) belongs in `route-adapters/`, never in `model/` or route files.
- **Status**: Compliant. `apps/iap-admin/src/features/dashboard/route-adapters/route-search-schema.ts` defines `dashboardRouteSearchSchema` and `dashboardReportTabSchema`, with unit tests in `route-search-schema.test.ts`.

## 3. Thin route definition
- **Rule**: Route files in `src/app/router/routes` must remain thin, only declaring route configuration, search validation, loaders, and delegating to the feature component.
- **Status**: Compliant. `apps/iap-admin/src/app/router/routes/_authenticated/index.tsx` delegates to `DashboardPage`, validates search with `dashboardRouteSearchSchema`, and loads breadcrumb metadata.

## 4. State ownership & isolation
- **Rule**: Client UI state coordinating components belongs in `context/store/` (Zustand), server state in TanStack Query, and route state in URL search parameters.
- **Status**: Compliant. `useShowReport` toggle lives in `context/store/report-show-report-store.ts`. Server reporting queries reside in `services/dashboard-service.ts` and individual table components with query caching (`staleTime: 10m`, `gcTime: 10m`). URL parameters sync tab selection via `reportTab`.

## 5. Contract types & schemas in workspace packages
- **Rule**: API contracts and Zod v4 schemas belong in `@iap/api-types/src/dashboard/index.ts`.
- **Status**: Compliant. Inferred types and strict validation schemas live in `@iap/api-types`.

## 6. Verification gates
- **Architecture check**: `pnpm architecture:check` passed with 0 violations.
- **TypeScript**: `pnpm typecheck` passed across all 17 packages.
- **Linter**: `pnpm --filter iap-admin lint` passed with 0 errors.
- **Unit tests**: All 6 test suites (17 tests) passed.
