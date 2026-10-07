# Task 01: Route Structure Reorganization

## Objectives

1. Move `_agent` directory from `apps/iap-admin/src/app/router/routes/_authenticated/_agent` to `apps/iap-admin/src/app/router/routes/_agent`.
2. Move `_customer-user` directory from `apps/iap-admin/src/app/router/routes/_authenticated/_customer-user` to `apps/iap-admin/src/app/router/routes/_customer-user`.
3. Configure `apps/iap-admin/src/app/router/routes/_agent/route.tsx` with `AgentLayout` and `beforeLoadAuth`.
4. Configure `apps/iap-admin/src/app/router/routes/_customer-user/route.tsx` with `CustomerUserLayout` and `beforeLoadAuth`.
5. Remove empty folders under `_authenticated`.
6. Update route file declarations to reflect the new route path IDs.

## File Changes

- **Move & Update**:
  - `src/app/router/routes/_authenticated/_agent` → `src/app/router/routes/_agent`
  - `src/app/router/routes/_authenticated/_customer-user` → `src/app/router/routes/_customer-user`
- **Route IDs**:
  - `/_agent`: Layout route for `/agent/**`
  - `/_agent/agent/claim-requests/`: `/agent/claim-requests/`
  - `/_agent/agent/claim-requests/create/`: `/agent/claim-requests/create/`
  - `/_agent/agent/claim-requests/$claimRequestId/`: `/agent/claim-requests/$claimRequestId/`
  - `/_agent/agent/claim-requests/$claimRequestId/claim-request-management/`: `/agent/claim-requests/$claimRequestId/claim-request-management/`
  - `/_agent/agent/users/create/`: `/agent/users/create/`
  - `/_customer-user`: Layout route for `/customer-user/**`
  - `/_customer-user/customer-user/`: `/customer-user/`
  - `/_customer-user/customer-user/claim-requests/`: `/customer-user/claim-requests/`
  - `/_customer-user/customer-user/claim-requests/$claimRequestId/claim-request-management/`: `/customer-user/claim-requests/$claimRequestId/claim-request-management/`

## Acceptance Criteria

- No `_agent` or `_customer-user` remains inside `_authenticated`.
- Route URLs are preserved exactly: `/agent/claim-requests/`, `/customer-user/`, etc.
- Each route group has its own independent `route.tsx` with `beforeLoadAuth`.
