# Task 01: API Contracts and Service

## Objective

Define the backend API contract schemas in `@iap/api-types` and implement `agentClaimRequestService` in `apps/iap-admin/src/features/agent-claim-requests/services/agent-claim-request-service.ts`.

## Reference Inspection

In `insurance-ui`:
- `src/features/agent-claim-requests/services/agent-claim-request-service.ts`:
  - `getPage`: `GET /claim-request-registery-agent/claim-requests/page-full`
    Query params: `page`, `size`, `filters`
    Response parsed with: `pageClaimRequestSchema`
  - `exportPageLiteExcel`: `GET /claim-request-registery-agent/claim-requests/page-lite/excel`
    Query params: `filters` (transformed via filter utils)
    Response: `Blob`
  - `delete`: `DELETE /claim-request-registery-agent/claim-requests/{id}`
    Response: `void`
  - `refreshPolicyDetails`: `POST /claim-requests/{id}/policy-details`
    Response parsed with: `claimRequestSchema`

## Target Architecture

1. **Contracts (`packages/api-types`)**:
   - Create `packages/api-types/src/agent-claim-request/index.ts`.
   - Export schemas:
     - `agentClaimRequestPageRequestSchema` (based on `createPageRequestSchema`)
     - `agentClaimRequestDeleteRequestSchema`
     - `agentClaimRequestRefreshPolicyDetailsRequestSchema`
     - `agentClaimRequestExportExcelRequestSchema`
   - Re-export `pageClaimRequestSchema`, `claimRequestSchema` from `@iap/api-types/src/claim-request`.
   - Re-export from `packages/api-types/src/index.ts`.

2. **Service (`apps/iap-admin`)**:
   - Create `apps/iap-admin/src/features/agent-claim-requests/services/agent-claim-request-service.ts`.
   - Use `getApiClient()` from `@iap/api-client`.
   - Use `transformApiFilterParams` from `@iap/shared-lib`.
   - Implement:
     - `getPage`: calls `/claim-request-registery-agent/claim-requests/page-full`
     - `exportPageLiteExcel`: calls `/claim-request-registery-agent/claim-requests/page-lite/excel`
     - `delete`: calls `/claim-request-registery-agent/claim-requests/${id}`
     - `refreshPolicyDetails`: calls `/claim-requests/${id}/policy-details`
   - Add unit tests in `agent-claim-request-service.test.ts`.

## Acceptance Criteria

- All request inputs and response outputs are validated with Zod v4 schemas.
- `transformApiFilterParams` is used for serializing filters.
- Service unit test covers happy path and parameter formatting.
