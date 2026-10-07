# TASK-01: API Contracts and Schemas

## Objective
Define all Zod v4 schemas, request/response models, and TypeScript types for Support Questions, Support Pages, and Support Features in `@iap/api-types/src/support/`, and feature-local form schemas in `apps/iap-admin/src/features/support-questions/model/`.

## Scope of Work

### 1. Update `packages/api-types/src/support/index.ts`
- Fix `supportRequiredParamInputDisplaySchema`:
  ```typescript
  export const supportRequiredParamInputDisplaySchema = z.enum([
    'TEXT',
    'LIST',
    'NOINPUT',
  ])
  ```
- Add Question Schemas:
  - `supportQuestionSchema` (with `id`, `questionKey`, `title`, `staticResponse`, `level`, `requiredParam`, `requiredParamInputDisplay`, `sequence`, `nextSelectableQuestionKeys`, `roles`, `pageTags`, `featureTags`, `active`, `createdAt`, `updatedAt`)
  - `supportQuestionListSchema`
  - `pageSupportQuestionSchema` (using `createPageResponseSchema` or `.loose()`)
  - `supportQuestionPayloadSchema` & `createSupportQuestionSchema`
  - `updateSupportQuestionPayloadSchema` & `updateSupportQuestionSchema`
  - `listSupportQuestionsRequestSchema` & `supportQuestionPageRequestSchema`
  - `getSupportQuestionRequestSchema`, `deleteSupportQuestionRequestSchema`, `bulkDeleteSupportQuestionsRequestSchema`
  - `emptySupportQuestionActionResponseSchema`
- Add Page Schemas:
  - `supportPageSchema`
  - `supportPageListSchema`
  - `pageSupportPageSchema`
  - `supportPagePayloadSchema`, `updateSupportPagePayloadSchema`
  - `supportPageRequestSchema`
  - `supportPageByIdRequestSchema`, `updateSupportPageRequestSchema`
  - `emptySupportPageActionResponseSchema`
- Add Feature Schemas:
  - `supportFeatureSchema`
  - `supportFeatureListSchema`
  - `pageSupportFeatureSchema`
  - `supportFeaturePayloadSchema`, `updateSupportFeaturePayloadSchema`
  - `supportFeatureRequestSchema`
  - `supportFeatureByIdRequestSchema`, `updateSupportFeatureRequestSchema`
  - `emptySupportFeatureActionResponseSchema`

### 2. Feature-Local Form Schemas in `apps/iap-admin/src/features/support-questions/model/`
- `support-question-form-schema.ts`: `supportQuestionFormSchema(t?: TFunction)` with validation messages from `supportQuestions.validation.*`.
- `support-page-form-schema.ts`: `supportPageFormSchema(t?: TFunction)` with validation messages from `supportPages.validation.*`.
- `support-feature-form-schema.ts`: `supportFeatureFormSchema(t?: TFunction)` with validation messages from `supportFeatures.validation.*`.

## Verification Criteria
- `pnpm --filter @iap/api-types typecheck` passes.
- Unit test verifying schema parsing against mock payloads.
