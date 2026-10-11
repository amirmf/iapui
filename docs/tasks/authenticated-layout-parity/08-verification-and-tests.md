# Task 08: Verification & Automated Tests

## Deliverables

1. **Unit & Component Tests**:
   - `nav-group.test.ts`: Test `isNavItemActive` across exact paths, trailing slashes, prefixes with `matchDescendants`, child items, and query parameters.
   - `app-sidebar.test.tsx`: Test role-based filtering of navigation items.
   - `authenticated-layout.test.tsx`: Test that `AuthenticatedLayout` renders `LayoutLoading`, `SidebarProvider`, `AppSidebar`, `Header`, `Outlet`, dialogs, and support widget.

2. **Quality & Boundary Verification**:
   - Run typecheck: `pnpm --filter @iap/ui typecheck` & `pnpm --filter iap-admin typecheck`.
   - Run tests: `pnpm --filter @iap/ui test` & `pnpm --filter iap-admin test`.
   - Run linter: `pnpm --filter iap-admin lint`.
   - Run architecture check: `pnpm architecture:check`.
   - Run build check: `pnpm --filter iap-admin build`.

## Verification Criteria

- All unit tests pass with zero failures.
- No TypeScript errors or ESLint warnings introduced.
- Application bundle builds successfully.
