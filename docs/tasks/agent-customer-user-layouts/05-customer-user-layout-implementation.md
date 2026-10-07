# Task 05: Customer-User Layout Implementation

## Objectives

1. Create `CustomerUserLayout` in `apps/iap-admin/src/shared/app-shell/customer-user-layout.tsx`.
2. Connect `CustomerUserLayout` to `apps/iap-admin/src/app/router/routes/_customer-user/route.tsx`.
3. Provide layout structure with:
   - Sidebar with `customerUserNavigation` items.
   - Header with `homePageUrl='/customer-user/'`.
   - Main content `<Outlet />` wrapped in container.
   - Optional support widget from `@iap/support`.
   - Security dialogs (`ForcePasswordChangeDialog`, `AuditInformationDialog`).
4. Support responsive mobile drawer and collapse state.

## Acceptance Criteria

- Visiting `/customer-user/` renders inside `CustomerUserLayout`.
- Sidebar displays only customer-user navigation items (`dashboard`, `claimRequests`).
- Header home link points to `/customer-user/`.
