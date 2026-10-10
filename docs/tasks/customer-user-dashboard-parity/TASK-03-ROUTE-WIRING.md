# Task 03 — Route wiring

## Objective

Update `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx` to mount `CustomerUserDashboardPage` instead of `PlaceholderPage`.

## Details

1. File: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx`.
2. Replace `PlaceholderPage` with `CustomerUserDashboardPage` imported from `@features/customer-user`.
3. Preserve loader: `loader: () => ({ crumb: 'dashboard' })`.
4. Ensure route definition remains thin without embedding inline state or business logic.

## Acceptance criteria

- Route renders `CustomerUserDashboardPage`.
- Breadcrumb metadata `{ crumb: 'dashboard' }` is preserved.
