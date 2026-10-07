---
name: admin-panel-routes
description: Guide for implementing and maintaining agent and customer-user panel routes and layouts in iap-admin with exact reference parity to insurance-ui, thin route files, breadcrumbs, and role-based guards.
---

# Admin Panel Routes and Layouts

Use this skill when implementing, extending, or replacing page placeholders in the `_agent` or `_customer-user` panel partitions in `apps/iap-admin`.

## Panel Partition Architecture

Panel partitions in `iap-admin` use top-level pathless grouping routes:

1. **Agent Panel (`_agent`)**:
   - Route root: `apps/iap-admin/src/app/router/routes/_agent/route.tsx`
   - Layout: `AgentLayout` from `@shared/app-shell/agent-layout`
   - Guard: `beforeLoadAuth` from `@iap/auth`
   - Child URL prefix: `/agent/**` (e.g. `/agent/claim-requests/`, `/agent/claim-requests/create/`)
   - Sidebar data: `agentNavigation` (`sidebar.claimRequestsAgent`, `sidebar.createClaimRequests`, `sidebar.createInsuredUser`)
   - Header home page URL: `/agent/claim-requests/`

2. **Customer-User Panel (`_customer-user`)**:
   - Route root: `apps/iap-admin/src/app/router/routes/_customer-user/route.tsx`
   - Layout: `CustomerUserLayout` from `@shared/app-shell/customer-user-layout`
   - Guard: `beforeLoadAuth` from `@iap/auth`
   - Child URL prefix: `/customer-user/**` (e.g. `/customer-user/`, `/customer-user/claim-requests/`)
   - Sidebar data: `customerUserNavigation` (`sidebar.dashboard`, `customerUser.claimRequests.nav`)
   - Header home page URL: `/customer-user/`

3. **Operations Panel (`_authenticated`)**:
   - Unprefixed URLs (`/`, `/claim-requests/`, etc.)
   - Layout: `AuthenticatedLayout` from `@shared/app-shell/authenticated-layout`

## Replacing Placeholders with Feature Pages

When replacing a route placeholder with a full feature page:

1. **Keep route files thin**:
   - The route file (`index.tsx`) must only declare the route, loader (with `crumb` identifier), route search validation, and import the page component from the feature public API (`@features/<feature>`).
   - Do not write business logic, inline state, or complex JSX in the route file.

2. **Breadcrumb metadata**:
   - Define `loader: () => ({ crumb: '<crumbKey>' })`.
   - Ensure the translation exists under `breadcrumb.<crumbKey>` in `common.json`.
   - The layout header automatically renders the breadcrumb sequence with the proper home link.

3. **URL and directory structure**:
   - Dedicated directories for static segments: e.g. `create/index.tsx`.
   - Flat filenames for dynamic parameters: e.g. `$claimRequestId.index.tsx` or `$claimRequestId.claim-request-management/index.tsx`.
   - Trailing slash rule: canonicalized with trailing slash (e.g. `/agent/claim-requests/`).

4. **Testing and verification**:
   - Maintain route tree coverage in `apps/iap-admin/src/shared/router/panel-routes.test.ts`.
   - Verify that panel routes match under their respective group (`_agent` or `_customer-user`) and never under `_authenticated`.
   - Run `pnpm --filter iap-admin typecheck`, `pnpm --filter iap-admin lint`, and `pnpm architecture:check`.
