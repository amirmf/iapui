# TASK-03: Services and Queries

## Objective
Implement typed API services for Support Questions, Support Pages, and Support Features using `@iap/api-client` and `@iap/shared-lib`.

## Scope of Work

### 1. `support-question-service.ts`
- Location: `apps/iap-admin/src/features/support-questions/services/support-question-service.ts`
- Endpoints:
  - `getPage`: `GET /support/questions/page` (validated with `supportQuestionPageRequestSchema` and `pageSupportQuestionSchema`)
  - `getPageFull`: `GET /support/questions/page-full`
  - `getById`: `GET /support/questions/{id}` (validated with `getSupportQuestionRequestSchema` and `supportQuestionSchema`)
  - `create`: `POST /support/questions` (payload `createSupportQuestionSchema`, returns `supportQuestionSchema`)
  - `update`: `PUT /support/questions/{id}` (payload `updateSupportQuestionPayloadSchema`, returns `supportQuestionSchema`)
  - `delete`: `DELETE /support/questions/{id}`
  - `bulkDelete`: `DELETE /support/questions/bulk-delete` with request body `ids: string[]`
- Filter Serialization: Use `transformApiFilterParams` from `@iap/shared-lib`.

### 2. `support-page-service.ts`
- Location: `apps/iap-admin/src/features/support-questions/services/support-page-service.ts`
- Endpoints:
  - `getPage`: `GET /support/pages/page`
  - `create`: `POST /support/pages`
  - `update`: `PUT /support/pages/{id}`
  - `delete`: `DELETE /support/pages/{id}`

### 3. `support-feature-service.ts`
- Location: `apps/iap-admin/src/features/support-questions/services/support-feature-service.ts`
- Endpoints:
  - `getPage`: `GET /support/features/page`
  - `create`: `POST /support/features`
  - `update`: `PUT /support/features/{id}`
  - `delete`: `DELETE /support/features/{id}`

## Verification Criteria
- Unit tests mocking API client to verify correct HTTP methods, URL construction, query parameter serialization, and response parsing.
