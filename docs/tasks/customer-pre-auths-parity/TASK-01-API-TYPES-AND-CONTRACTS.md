# Task 01: API Types and Contracts

## Objective
Define the backend contract schemas in `packages/api-types/src/pre-auths/index.ts` and re-export them from `packages/api-types/src/index.ts`.

## Source of Truth
- OpenAPI Operation: `findMyPreAuths` (`GET /api/my/iap/pre-auths/page-full`) -> `PagePreAuthInquiryDto`
- OpenAPI Operation: `getSubInsuredPeople` (`GET /api/my/iap/sub-insured-people/{policyId}`) -> `SubInsuredPersonResponse[]`
- Reference Schemas:
  - `insurance-ui/src/features/my-iap/pre-auths/data/pre-auth-schema.ts`
  - `insurance-ui/src/features/my-iap/claim-requests/data/sub-insured-person-schema.ts`

## Files to Create / Modify
1. Create `packages/api-types/src/pre-auths/index.ts`:
   - `getPreAuthsRequestSchema`: `{ policyId: number, nationalCode: string, page?: number, size?: number }`
   - `preAuthSchema`: 38 fields from OpenAPI `PreAuthInquiryDto` using `.nullish()` and `.loose()`
   - `pagePreAuthSchema`: `createPageResponseSchema(preAuthSchema)`
   - `getSubInsuredPeopleRequestSchema`: `{ policyId: number }`
   - `subInsuredPersonSchema`: `{ id: number | null, nationalCode: string, fullName: string, isForeign?: 'Y' | 'N' | null }`
   - Inferred types: `PreAuth`, `PagePreAuth`, `GetPreAuthsRequest`, `SubInsuredPerson`
2. Update `packages/api-types/src/index.ts`:
   - Add `export * from './pre-auths'`

## Acceptance Criteria
- Uses Zod v4 public APIs (`z` from `zod`).
- Paginated responses use `createPageResponseSchema` from `@iap/api-types/src/common`.
- `pnpm --filter @iap/api-types typecheck` passes.
