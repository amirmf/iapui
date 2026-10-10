# Customer Portal Discrepancy Matrix & Architectural Mapping

## 1. Route Comparison Matrix

| Experience / Intent | Reference URL (`insurance-ui`) | Target URL (`apps/iap-app`) | Target Route File Path |
| --- | --- | --- | --- |
| Customer Home | `/_app/myiap/` | `/` | `src/app/router/routes/_authenticated/index.tsx` |
| My Claims List | `/_app/myiap/myclaims/` | `/myclaims/` | `src/app/router/routes/_authenticated/myclaims/index.tsx` |
| Create Claim | `/_app/myiap/myclaims/create` | `/myclaims/create/` | `src/app/router/routes/_authenticated/myclaims/create/index.tsx` |
| Claim Details | `/_app/myiap/myclaims/$id` | `/myclaims/$id/` | `src/app/router/routes/_authenticated/myclaims/$id.index.tsx` |
| Special Diseases List | `/_app/myiap/special-diseases/` | `/special-diseases/` | `src/app/router/routes/_authenticated/special-diseases/index.tsx` |
| Create Special Disease | `/_app/myiap/special-diseases/create` | `/special-diseases/create/` | `src/app/router/routes/_authenticated/special-diseases/create/index.tsx` |
| Special Disease Details | `/_app/myiap/special-diseases/$id` | `/special-diseases/$id/` | `src/app/router/routes/_authenticated/special-diseases/$id.index.tsx` |
| Pre-Authorizations | `/_app/myiap/pre-auths/` | `/pre-auths/` | `src/app/router/routes/_authenticated/pre-auths/index.tsx` |

## 2. Structural & Architectural Parity

1. **Path Prefix Absence**:
   - The user-facing prefix `/myiap` is completely removed in `iap-app`.
   - Browser URLs are clean, direct customer URLs (e.g. `/myclaims/` instead of `/myiap/myclaims/`).
2. **Trailing Slash Canonicalization**:
   - In `iap-app`, `trailingSlash: 'always'` is active.
   - All static pages use dedicated directories containing `index.tsx` (e.g. `myclaims/create/index.tsx`).
   - Dynamic parameters map to flat file routes with `.index.tsx` (e.g. `myclaims/$id.index.tsx`).
3. **Backend Service Contracts**:
   - Despite URL changes on the frontend, backend API endpoint paths remain unchanged:
     - `GET /my/iap/claim-requests/page-full`
     - `GET /my/iap/claim-requests/${id}`
     - `POST /claim-requests`
     - `POST /my/iap/claim-requests/objections`
     - `GET /my/iap/my-policies`
     - `GET /my/iap/sub-insured-people`
     - `GET /my/iap/my-bank-account`
     - `POST /my/iap/add-my-bank-account`
     - `PUT /my/iap/my-bank-account/${id}`
     - `GET /my/special-diseases`
     - `GET /my/special-diseases/${id}`
     - `POST /my/special-diseases`
     - `POST /my/special-diseases/${id}/objections`
     - `GET /my/iap/pre-auths/page-full`
4. **Component Boundary Enforcement**:
   - No `ui/` directory under application or feature folders; primitives come exclusively from `@iap/ui`.
   - Page-exclusive components reside under `pages/<page>/components/`.
   - Feature-shared components reside under `features/<feature>/components/`.
