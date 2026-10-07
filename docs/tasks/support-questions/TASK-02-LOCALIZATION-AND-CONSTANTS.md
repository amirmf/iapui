# TASK-02: Localization and Constants

## Objective
Add all user-facing translation keys to `apps/iap-admin/src/shared/i18n/locales/fa/common.json` exactly matching `insurance-ui`, and define constants for input displays, statuses, and options in `apps/iap-admin/src/features/support-questions/constants/support-question-constant.ts`.

## Scope of Work

### 1. Translations in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`
- Add `supportQuestions`:
  - `title`, `entityName`, `create`, `refresh`, `noQuestions`
  - `columns`: `key`, `title`, `level`, `nextSelectableQuestionKeys`, `requiredParam`, `requiredParamInputDisplay`, `status`, `sequence`, `roles`
  - `fields`: `key`, `title`, `staticResponse`, `level`, `nextSelectableQuestionKeys`, `requiredParam`, `requiredParamInputDisplay`, `selectInputDisplay`, `sequence`, `roles`, `selectRoles`, `pageTags`, `selectPageTags`, `featureTags`, `selectFeatureTags`, `active`
  - `filters`: `questionKey`, `title`
  - `inputDisplay`: `TEXT`, `LIST`, `NOINPUT`
  - `status`: `active`, `inactive`
  - `actions`: `viewDetails`, `edit`, `delete`
  - `dialog`: `create`, `edit`, `details`
  - `delete`: `title`
  - `bulkDelete`: `button`, `noSelection`
  - `messages`: `created`, `updated`, `deleted`
  - `validation`: `key`, `title`
- Add `supportPages`:
  - `title`, `columns`, `fields`, `actions`, `status`, `dialog`, `delete`, `empty`, `messages`, `validation`
- Add `supportFeatures`:
  - `title`, `columns`, `fields`, `actions`, `status`, `dialog`, `delete`, `empty`, `messages`, `validation`

### 2. Constants in `apps/iap-admin/src/features/support-questions/constants/support-question-constant.ts`
- `SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES = ['TEXT', 'LIST', 'NOINPUT'] as const`
- `SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_TRANSLATION_KEYS`
- `getSupportRequiredParamInputDisplayOptions(t: TFunction)`
- Status badge classes:
  - `supportQuestionStatusColors`:
    ```typescript
    export const supportQuestionStatusColors: Record<'active' | 'inactive', string> = {
      active: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
      inactive: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
    }
    ```
- Party role options and colors helper or integration with existing party constant.

## Verification Criteria
- All keys present in `fa/common.json` without missing or corrupted Unicode characters.
- Unit test for `getSupportRequiredParamInputDisplayOptions` verifying all 3 options (`TEXT`, `LIST`, `NOINPUT`).
