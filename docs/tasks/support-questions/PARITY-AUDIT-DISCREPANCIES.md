# Parity Audit & Discrepancies: Support Questions

Comparison between `insurance-ui` (`src/features/support-questions`) and `iap-admin` (`apps/iap-admin/src/features/support-questions`).

## 1. Route & Architecture Discrepancies
- **Reference:** `src/routes/_authenticated/support-questions/index.tsx` delegates to `pages/support-questions-page.tsx`.
- **Target:** `apps/iap-admin/src/app/router/routes/_authenticated/support-questions/index.tsx` is currently a placeholder (`PlaceholderPage`).
- **Remediation:** Replace placeholder with thin route delegating to `@/features/support-questions` `SupportQuestionsPage`. Under single-root-route pattern, the page component lives directly at `src/features/support-questions/support-questions-page.tsx`.

## 2. API Contract & Schema Discrepancies
- **Reference Contracts:**
  - `src/features/support-questions/data/support-question-schema.ts`
  - `src/features/support-questions/data/support-page-schema.ts`
  - `src/features/support-questions/data/support-feature-schema.ts`
- **Target Architecture Rule:** API schemas belong in `packages/api-types/src/support/index.ts`.
- **Enum Discrepancy:** In `packages/api-types/src/support/index.ts`, `supportRequiredParamInputDisplaySchema` is currently defined as `z.enum(['LIST', 'TEXT'])`, missing `'NOINPUT'`. In `insurance-ui`, the values are `['TEXT', 'LIST', 'NOINPUT']`.
- **Remediation:**
  - Update `supportRequiredParamInputDisplaySchema` in `packages/api-types/src/support/index.ts` to include `'NOINPUT'`.
  - Add `supportQuestionSchema`, `pageSupportQuestionSchema`, `createSupportQuestionSchema`, `updateSupportQuestionSchema`, `supportPageSchema`, `pageSupportPageSchema`, `supportPagePayloadSchema`, `updateSupportPageSchema`, `supportFeatureSchema`, `pageSupportFeatureSchema`, `supportFeaturePayloadSchema`, `updateSupportFeatureSchema`, plus path, page request, and action schemas in `packages/api-types/src/support/index.ts`.
  - Place client form schemas (`supportQuestionFormSchema`, `supportPageFormSchema`, `supportFeatureFormSchema`) under `apps/iap-admin/src/features/support-questions/model/`.

## 3. Constants & Enum Translations
- **Reference:** In `insurance-ui`, input display values and options are in `src/constants/tickets-constant.ts`, and party roles are in `src/constants/party-constant.ts`.
- **Target:** Per feature boundaries, create `apps/iap-admin/src/features/support-questions/constants/support-question-constant.ts` containing:
  - `SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES = ['TEXT', 'LIST', 'NOINPUT'] as const`
  - `SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_TRANSLATION_KEYS`
  - `getSupportRequiredParamInputDisplayOptions(t)`
  - `supportQuestionStatusColors`
  - Party role translation keys and colors (reused from user-account / party constants).

## 4. UI Components & Dependencies
- **MarkdownEditor:**
  - In `insurance-ui`, `support-question-form-dialog.tsx` renders `MarkdownEditor` using `@tiptap/react`.
  - In `iap-ui`, `@tiptap/react` is not installed; existing multiline text fields across `iap-admin` use `Textarea` / `TextareaField`.
  - **Proposed Approach:** Provide `Textarea` or equivalent clean text control for `staticResponse` unless the user explicitly requests adding `@tiptap/react`.
- **TwoLineCell / TwoLineHeader:**
  - In `insurance-ui`, imported from `@/components/data-table/two-line-cell`.
  - In `iap-admin`, imported from `@shared/tables`.
- **TableFilterQueryParams:**
  - Imported from `@shared/tables/filter`.

## 5. State Management & Context
- **Reference:** Stored in `context/support-question-context.tsx`, `support-page-context.tsx`, `support-feature-context.tsx` with combined Zustand store + provider.
- **Target:** Per `APPLICATION-ARCHITECTURE.md`, clean separation between `context/store/` (Zustand stores) and `context/provider/` (React providers).
