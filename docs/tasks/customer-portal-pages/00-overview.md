# Customer Portal Pages Parity Overview

## Scope & Objective

Implement customer-facing pages in `apps/iap-app` with exact reference parity to `insurance-ui` (`src/routes/_app/myiap/**` and `src/features/my-iap/**`), adhering to `docs/architecture/APPLICATION-ARCHITECTURE.md` and `customer-portal-app` skill.

## Key Architectural Constraints

1. **No `/myiap` Route Prefix in `iap-app`**:
   - In `insurance-ui`, routes live under `/_app/myiap/**`.
   - In `apps/iap-app`, routes live directly under `_authenticated/**`:
     - Home: `/` (`_authenticated/index.tsx`)
     - My Claims: `/myclaims/` (`_authenticated/myclaims/index.tsx`)
     - Create Claim: `/myclaims/create/` (`_authenticated/myclaims/create/index.tsx`)
     - Claim Detail: `/myclaims/$id/` (`_authenticated/myclaims/$id.index.tsx`)
     - Special Diseases: `/special-diseases/` (`_authenticated/special-diseases/index.tsx`)
     - Create Special Disease: `/special-diseases/create/` (`_authenticated/special-diseases/create/index.tsx`)
     - Special Disease Detail: `/special-diseases/$id/` (`_authenticated/special-diseases/$id.index.tsx`)
     - Pre-Authorizations: `/pre-auths/` (`_authenticated/pre-auths/index.tsx`)
2. **Directory-Based Routing with Trailing Slash**:
   - Every static route segment has a dedicated folder with `index.tsx` (e.g. `myclaims/create/index.tsx`).
   - Dynamic parameters use flat file routes (e.g. `myclaims/$id.index.tsx`).
3. **Component Granularity**:
   - Keep page route files thin (route definition, search validation, loaders, composition).
   - Decompose page logic into small, focused single-responsibility components under `pages/<page>/components/` or `features/<feature>/components/`.
   - No `ui/` directories inside features or applications; primitives import from `@iap/ui`.
4. **Backend Contracts & Schemas**:
   - Every endpoint has feature-local or shared Zod schemas. Request schemas validate inputs; response schemas validate outputs. Types inferred via `z.infer`.
   - Filterable query params adhere to backend contract using `@iap/shared-lib`.
5. **State Ownership**:
   - TanStack Query owns all server/remote state.
   - Zustand stores (`context/store/`) only for coordinated client UI state.

## Task Breakdown Index

| Task File | Feature / Route | Reference Page / Component |
| --- | --- | --- |
| `01-my-claims-list-page.md` | `/myclaims/` | `MyClaimRequestsPage` (`features/my-iap/claim-requests/pages/my-claim-requests-page.tsx`) |
| `02-my-claims-create-page.md` | `/myclaims/create/` | `MyClaimRequestCreatePage` (`features/my-iap/claim-requests/pages/my-claim-request-create-page.tsx`) |
| `03-my-claims-detail-page.md` | `/myclaims/$id/` | `MyClaimRequestDetailPage` (`features/my-iap/claim-requests/pages/my-claim-request-detail-page.tsx`) |
| `04-special-diseases-list-page.md` | `/special-diseases/` | `MySpecialDiseasesPage` (`features/my-iap/special-diseases/pages/my-special-diseases-page.tsx`) |
| `05-special-diseases-create-page.md` | `/special-diseases/create/` | `MySpecialDiseaseCreatePage` (`features/my-iap/special-diseases/pages/my-special-disease-create-page.tsx`) |
| `06-special-diseases-detail-page.md` | `/special-diseases/$id/` | `MySpecialDiseaseDetailPage` (`features/my-iap/special-diseases/pages/my-special-disease-detail-page.tsx`) |
| `07-pre-auths-page.md` | `/pre-auths/` | `PreAuthsPage` (`features/my-iap/pre-auths/pages/pre-auths-page.tsx`) |
| `DISCREPANCY-MATRIX.md` | Architecture & API Matrix | Route differences, API paths, and translation mappings |
