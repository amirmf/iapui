# Task 02 — Feature public API

## Objective

Establish the public API barrel file `apps/iap-admin/src/features/customer-user/index.ts`.

## Details

1. Export `CustomerUserDashboardPage` from `./components/customer-user-dashboard-page`.
2. Follow application architecture guidelines:
   - Features expose only deliberate public entry points.
   - Consumers (`apps/iap-admin/src/app/router/...`) import exclusively from `@features/customer-user`.

## Acceptance criteria

- `apps/iap-admin/src/features/customer-user/index.ts` cleanly exports `CustomerUserDashboardPage`.
- Path aliases configured in `tsconfig.json` resolve `@features/customer-user` correctly.
