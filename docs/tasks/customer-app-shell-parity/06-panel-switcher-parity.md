# Task 06: Panel Switcher Parity

## Objective

Enhance `AppPanelSwitcher` in `apps/iap-app` to register all 4 authorized panels with identical order and access control checks matching `insurance-ui` (`panel-registry.ts`) and `iap-admin` (`admin-panel-switcher.tsx`).

## Reference Implementation

In `insurance-ui/src/components/layout/panel-registry.ts`:
Order:
1. `evaluation` (`/`)
2. `agent` (`/agent/claim-requests`)
3. `customer` (`/myiap`)
4. `customerUser` (`/customer-user`)

Access checks:
- Evaluation: `canAccessAdminPanel(roles)`
- Agent: `canAccessPathByRole(roles, '/agent') && !canNotAccessPathByRole(roles, '/agent')`
- Customer: `canAccessAppPanel(roles)`
- Customer-User: `canAccessPathByRole(roles, '/customer-user') && !canNotAccessPathByRole(roles, '/customer-user')`

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/app-panel-switcher.tsx`
- Consume `canAccessAdminPanel`, `canAccessAppPanel`, `canAccessPathByRole`, `canNotAccessPathByRole`, and `useAuthSession` from `@iap/auth`.
- Build `panels` list with correct domain URLs:
  - Evaluation (`admin`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/`)
  - Agent (`agent`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/agent/claim-requests/`)
  - Customer (`app`): `VITE_IAP_APP_DOMAIN_URL` (`/`)
  - Customer-User (`customerUser`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/customer-user/`)
- Current panel: `app` (`panelSwitcher.panels.customer`).
- Inverted tone: `tone='inverted'` for contrast against the branded header background.
