# Task 02: Translations and Constants

## Objective

Add exact Persian translations for `agent.claimRequests` in `apps/iap-admin/src/shared/i18n/locales/fa/common.json` and create the feature constants in `apps/iap-admin/src/features/agent-claim-requests/constants/agent-claim-request-constant.ts`.

## Reference Inspection

In `insurance-ui`:
- `src/locales/fa.json`:
  Contains `agent.claimRequests`:
  - `title`: `"درخواست‌های من"`
  - `refresh`: `"بروزرسانی"`
  - `columns`: labels for each table header (`extNationalCode`, `extDisplayName`, etc.)
  - `filters`: labels for filter fields
  - `messages`: `policyDetailsUpdated`, `claimIdMissing`, `deleted`
  - `actions`: `viewDetails`, `refreshPolicyDetails`, `completionOfDocuments`, `delete`
  - `create`: `title: "ثبت درخواست خسارت"`
- `src/constants/claim-status-constant.ts`:
  Contains status badge color mappings (`claimStatusColors`), translation keys (`CLAIM_REQUEST_STATUS_TRANSLATION_KEYS`), border colors, and options generators.

## Target Architecture

1. **Translations**:
   - Merge `agent.claimRequests` into `apps/iap-admin/src/shared/i18n/locales/fa/common.json` preserving exact Persian strings and structure from `insurance-ui`.
2. **Constants**:
   - Create `apps/iap-admin/src/features/agent-claim-requests/constants/agent-claim-request-constant.ts`.
   - Export status color records, status translation keys, and helper functions cleanly.
   - Colocate unit test `agent-claim-request-constant.test.ts`.

## Acceptance Criteria

- All required translation keys exist in `fa/common.json`.
- Persian values match `insurance-ui` character-for-character.
- Constants file is tested and type-safe.
