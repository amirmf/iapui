# Task 02 — constants and localization parity

Reference: `insurance-ui/src/constants/claim-status-constant.ts`, `insurance-ui/src/locales/fa.json`.
Target owners: `apps/iap-admin/src/features/claim-requests/model/claim-request-status.ts`, `apps/iap-admin/src/features/claim-requests/index.ts`, `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

## Responsibilities

1. Enum constant centralization:
   - Ensure `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS` and `getClaimRequestStatusOptions` in `claim-requests/model/claim-request-status.ts` match reference.
   - Export `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS` and `getClaimRequestStatusOptions` from `@features/claim-requests` public API (`index.ts`).
   - Eliminate duplicated/diverged `dashboard.reports.statuses.*` in localization. Consume standard `claimRequests.status.*` translation keys through the constant.
2. Localization parity in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`:
   - Add missing `claimRequests.status.approvedSummery`: `"ارزیابی شده"`.
   - Add missing filter groups under `dashboard.reports.filterGroups`:
     - `claim`: `"اطلاعات درخواست"`
     - `assessment`: `"ارزیابی"`
     - `policyholder`: `"بیمه‌گذار و بیمه‌نامه"`
     - `organization`: `"سازمان و شعبه"`
     - `financial`: `"مالی"`
   - Add missing filter labels:
     - `assignedUserUsername`: `"کدملی ارزیاب"`
     - `assignedUserDisplayName`: `"نام ارزیاب"`
   - Add missing column labels:
     - `assignedUserUsername`: `"کدملی ارزیاب"`
     - `docType`: `"نوع سند"`
   - Add missing error message:
     - `dashboard.reports.errors.agreementsWithoutMainAssessmentUser`: `"بارگذاری قراردادهای بدون ارزیاب اصلی ناموفق بود."`

## Acceptance criteria

- All translation keys accessed by dashboard components exist in `common.json`.
- Status translations align with the central claim request status constant.
