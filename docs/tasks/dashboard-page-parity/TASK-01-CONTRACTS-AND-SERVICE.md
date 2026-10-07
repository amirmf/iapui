# Task 01 — contracts and service parity

Reference: `insurance-ui/src/features/dashboard/services/dashboard-service.ts`, `insurance-ui/src/features/dashboard/data/dashboard-report-schema.ts`.
Target owners: `packages/api-types/src/dashboard/index.ts`, `apps/iap-admin/src/features/dashboard/services/dashboard-service.ts`.

## Responsibilities

1. Ensure all 6 endpoint operations match exact reference HTTP methods, URL paths, and query parameters:
   - `findAgreementsWithoutMainAssessmentUser`: `GET /agreements/reports/without-main-assessment-user` (validates empty request schema, returns `AgreementsWithoutMainAssessmentUserResponse`).
   - `reportSumByAssignee`: `GET /claim-requests/reports/sum-by-assignee` (params: `transformApiFilterParams(filters)`, returns `AssigneeStatusSumReport[]`).
   - `reportCountByStatus`: `GET /claim-requests/reports/count-by-status` (params: `transformApiFilterParams(filters)`, returns `StatusDocTypeCountReport[]`).
   - `reportCountByAssignee`: `GET /claim-requests/reports/count-by-assignee` (params: `transformApiFilterParams(filters)`, returns `AssigneeStatusCountReport[]`).
   - `reportCountByAssigneeSummary`: `GET /claim-requests/reports/count-by-assignee-summary` (params: `transformApiFilterParams(filters)`, returns `AssigneeStatusCountReport[]`).
   - `reportDistributionByStatus`: `GET /claim-requests/reports/distribution-by-status` (params: `transformApiFilterParams(request.filters)`, returns `StatusDistributionReport[]`).
2. Schema parity:
   - Verify request schemas validate with strict mode where specified.
   - Response schemas use Zod v4 and accept `.nullish()` fields.
   - Infer types from schemas (`z.infer`).
3. Service integration:
   - Use `getApiClient()` through `@iap/api-client`.
   - Forward `signal` on all operations.

## Acceptance criteria

- Unit tests in `dashboard-service.test.ts` verify each operation's method, path, parameter transformation, and schema parsing.
- Invalid payloads fail at schema validation before network call.
