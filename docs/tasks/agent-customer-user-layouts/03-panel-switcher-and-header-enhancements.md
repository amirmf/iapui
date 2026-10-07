# Task 03: Panel Switcher and Header Enhancements

## Objectives

1. Enhance `AdminHeader` (`apps/iap-admin/src/shared/app-shell/admin-header.tsx`):
   - Accept optional `homePageUrl?: string` (defaults to `/`).
   - Allow passing panel-specific branding or context if applicable.
2. Enhance `AdminPanelSwitcher` (`apps/iap-admin/src/shared/app-shell/admin-panel-switcher.tsx`):
   - Add panels for `agent` (`/agent/claim-requests/`) and `customerUser` (`/customer-user/`) matching reference `insurance-ui/src/components/layout/panel-registry.ts`.
   - Determine current panel based on pathname (`/agent` -> `agent`, `/customer-user` -> `customerUser`, `/` -> `admin`).
   - Filter accessible panels using `canAccessPathByRole(roles, landingPath)`.
3. Support breadcrumb home link target corresponding to `homePageUrl`.

## Acceptance Criteria

- When on `/agent/**`, active panel in switcher indicates Agent panel, and clicking logo/home navigates to `/agent/claim-requests/`.
- When on `/customer-user/**`, active panel indicates Customer User panel, and home navigates to `/customer-user/`.
- Operations routes remain mapped to evaluation panel (`/`).
