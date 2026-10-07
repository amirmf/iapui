# Agent and Customer-User Layout Parity & Route Reorganization

## Scope and Intent

Extract `_agent` and `_customer-user` route groups out of `_authenticated` in `apps/iap-admin` and implement dedicated layout shells for each group matching reference project `insurance-ui` (`src/routes/agent` and `src/routes/customer-user`) while conforming to `iap-ui` software architecture (`docs/architecture/APPLICATION-ARCHITECTURE.md`).

Pages remain thin placeholders (`PlaceholderPage`); only layouts, app-shell components, navigation data, and route boundaries are implemented.

## Reference Mapping

| Reference (`insurance-ui`) | Target (`iap-admin`) | Ownership / Role |
| --- | --- | --- |
| `src/routes/agent/route.tsx` | `src/app/router/routes/_agent/route.tsx` | Agent panel layout route & `beforeLoadAuth` guard |
| `src/routes/customer-user/route.tsx` | `src/app/router/routes/_customer-user/route.tsx` | Customer-user panel layout route & `beforeLoadAuth` guard |
| `src/components/layout/agent-layout.tsx` | `src/shared/app-shell/agent-layout.tsx` | Layout shell for agent panel |
| `src/components/layout/customer-user-layout.tsx` | `src/shared/app-shell/customer-user-layout.tsx` | Layout shell for customer-user panel |
| `src/components/layout/data/agent-sidebar-data.ts` | `src/shared/app-shell/agent-navigation.ts` | Agent sidebar navigation items & hook |
| `src/components/layout/data/customer-user-sidebar-data.ts` | `src/shared/app-shell/customer-user-navigation.ts` | Customer-user sidebar navigation items & hook |
| `src/components/layout/header.tsx` | `src/shared/app-shell/admin-header.tsx` | Header supporting `homePageUrl` & panel branding |
| `src/components/layout/panel-registry.ts` | `src/shared/app-shell/admin-panel-switcher.tsx` | Panel registration for operations, agent, customer, customer-user |

## Architectural Decisions

1. **Route Partitions**:
   - `src/app/router/routes/_agent/agent/**` owns `/agent/**` (layout: `AgentLayout`).
   - `src/app/router/routes/_customer-user/customer-user/**` owns `/customer-user/**` (layout: `CustomerUserLayout`).
   - Operations routes remain under `src/app/router/routes/_authenticated/**` (layout: `AuthenticatedLayout`).
   - Sibling pathless groups provide clean layout isolation without duplicating URL prefixes.

2. **Clean Code & Small Components**:
   - App shell follows single-responsibility principle: separate layout, sidebar, header, panel switcher, and navigation data.
   - Reusable primitives from `@iap/ui` and `@iap/panel-switcher`.
   - Responsive sidebar with mobile drawer and collapsible state.
   - Authentication lifecycle and security dialogs from `@iap/auth`.

3. **Translations & Exact Keys**:
   - Navigation titles use exact keys from reference (`sidebar.claimRequestsAgent`, `sidebar.createClaimRequests`, `sidebar.createInsuredUser`, `sidebar.dashboard`, `customerUser.claimRequests.nav`).
   - Panel switcher keys: `panelSwitcher.panels.agent`, `panelSwitcher.panels.customerUser`.

## Task Index

- `01-route-structure-reorganization.md`: Move routes out of `_authenticated` into `_agent` and `_customer-user`.
- `02-layout-contracts-and-sidebar-data.md`: Navigation items, icons, and locale entries.
- `03-panel-switcher-and-header-enhancements.md`: Header `homePageUrl` support and multi-panel registry.
- `04-agent-layout-implementation.md`: `AgentLayout` and agent shell components.
- `05-customer-user-layout-implementation.md`: `CustomerUserLayout` and customer-user shell components.
- `06-verification-and-tests.md`: Router tests, typecheck, lint, build verification.
