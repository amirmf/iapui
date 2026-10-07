# Task 04: Agent Layout Implementation

## Objectives

1. Create `AgentLayout` in `apps/iap-admin/src/shared/app-shell/agent-layout.tsx`.
2. Connect `AgentLayout` to `apps/iap-admin/src/app/router/routes/_agent/route.tsx`.
3. Provide layout structure with:
   - Sidebar with `agentNavigation` items.
   - Header with `homePageUrl='/agent/claim-requests/'`.
   - Main content `<Outlet />` wrapped in container.
   - Optional support widget from `@iap/support`.
   - Security dialogs (`ForcePasswordChangeDialog`, `AuditInformationDialog`).
4. Support responsive mobile drawer and collapse state.

## Acceptance Criteria

- Visiting `/agent/claim-requests/` renders inside `AgentLayout`.
- Sidebar displays only agent navigation items.
- Header home link points to `/agent/claim-requests/`.
- Mobile drawer and desktop collapse toggle work smoothly.
