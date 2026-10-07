# Sub-Users Reference Contract & Cascading Architecture Decision

## Scope and Accepted Decision

On 2026-10-07 the user explicitly requested full parity implementation for the admin
`/_authenticated/sub-users/` page matching `insurance-ui`, including exact API endpoints,
request/response schemas, component names, constants, and Persian translations.
Existing application architecture (`docs/architecture/APPLICATION-ARCHITECTURE.md`) governs
ownership, import boundaries, thin routes, and monorepo structure.

## Architectural Boundaries

- **Route (`Thin Route`)**: `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`
  declares the route, breadcrumb metadata (`crumb: 'sub-users'`), search validation with `subUserRouteSearchSchema`,
  and delegates directly to `SubUsersPage`.
- **Page Composition**: `apps/iap-admin/src/features/sub-users/pages/sub-users-page.tsx`
  coordinates the tripartite hierarchical layout wrapped in `SubUserProvider` and `SubUsersAgreementsProvider`:
  1. `SubUserSection` (Master table, toolbar, pagination, action dialogs)
  2. `SubUsersAgreementsSection` (First-tier child table for selected sub-user's agreements)
  3. `SubUsersAgreementPartySection` (Second-tier child table for selected agreement's parties)
- **Contract & Schemas**: Public domain schemas reside in `packages/api-types/src/sub-user/`
  and repetitive response schemas in `packages/api-types/src/repetitive-responses/`,
  exported through the monorepo root `@iap/api-types`.
- **API Services**: `apps/iap-admin/src/features/sub-users/services/sub-user-service.ts`
  uses `createApiClient()` with feature-local Zod request/response parsing and query keys.
- **Form Resolution & Payload Sanitization**:
  Form dialogs utilize `typedZodResolver` with translated schema factories. During submission,
  role-conditioned fields (e.g., `medicalCouncilNumber` only for `ROLE_DOCTOR`) are sanitized
  so omitted roles never send empty or invalid payloads to the backend.
- **Translations**:
  100% byte-for-byte Persian translation parity with `insurance-ui/src/locales/fa.json` under
  `subUsers.*` and `breadcrumb["sub-users"]` in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

## Multi-Tier Cascading Master-Detail Pattern

The sub-users feature establishes the standard tripartite cascading pattern:
1. **Selection Flow**:
   - Master row selected -> triggers query for Tier 1 (`sub-user-agreements`) via `enabled: Boolean(selectedSubUserId)`.
   - Tier 1 row selected -> triggers query for Tier 2 (`sub-user-agreement-parties`) via `enabled: Boolean(selectedAgreementId)`.
2. **Cascaded Invalidation and Cleanup**:
   - Changing or unselecting the master row immediately resets both Tier 1 and Tier 2 selection stores.
   - Unmounting the page component clears all stores via provider cleanup effects.
3. **Empty States**:
   - Tier 1 and Tier 2 render contextual empty/prompt states when no parent item is selected.
