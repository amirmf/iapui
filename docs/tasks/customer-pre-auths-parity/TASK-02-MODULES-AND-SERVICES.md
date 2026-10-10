# Task 02: Insurance Policy & Sub-Insured People Modules/Services

## Objective
Provide reusable modules or services for fetching the authenticated user's policies and sub-insured dependents in `apps/iap-app`.

## Reference Architecture
- In `insurance-ui`:
  - `src/features/my-iap/claim-requests/hooks/use-get-my-insurance-policy.ts` calls `GET /my/iap/my-policies`
  - `src/features/my-iap/claim-requests/services/sub-insured-person-service.ts` calls `GET /my/iap/sub-insured-people/${policyId}`
- In `iap-ui`:
  - Feature-to-feature imports are disallowed by `APPLICATION-ARCHITECTURE.md`.
  - Reusable capabilities belong in `src/modules/`.
  - Create `apps/iap-app/src/modules/sub-insured-people/`:
    - `services/sub-insured-person-service.ts`: calls `GET /my/iap/sub-insured-people/${policyId}` using `getApiClient()` and validates with `z.array(subInsuredPersonSchema)`.
    - `queries/use-sub-insured-people.ts`: query options with key `['sub-insured-people', policyId]`, enabled when `policyId > 0`.
    - `index.ts`: public exports.
  - Create or export `apps/iap-app/src/modules/insurance-policies/`:
    - Service calls `GET /my/iap/my-policies`.
    - Query hook/options `insurancePolicyQuery` with key `['insurance-policies']`.
    - Re-export from `apps/iap-app/src/features/home/` to avoid breaking existing imports.

## Acceptance Criteria
- Direct feature-to-feature dependencies are avoided.
- API calls validate through Zod contracts.
- TanStack Query hooks manage server cache with 30s stale/gc time.
