# Task 04 — Constants and Translations

## Objective
Verify all enums, constants, colors, and locale strings matching reference `insurance-ui` in `apps/iap-admin`.

## Reference Inspection
1. `constants/claim-status-constant.ts`:
   - Duplicate badges, box colors, status colors, and translation keys are defined centrally.
   - Target `apps/iap-admin/src/features/claim-requests/model/claim-request-status.ts` already houses `CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS`, `CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS`, `CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS`, and status colors.
   - Target `apps/iap-admin/src/features/customer-user/model/customer-user-claim-constant.ts` houses panel-specific filters and status colors.
2. Locales `locales/fa.json` and `locales/en.json`:
   - `claim-request-management` breadcrumb key: already exists in `common.json` (`مدیریت درخواست خسارت`).
   - `customerUser.claimRequests.fields.*`:
     - `policyNumber`: `شماره بیمه‌نامه` / `Policy number`
     - `status`: `وضعیت` / `Status`
     - `submitDate`: `تاریخ خدمت` / `Service date`
     - `amount`: `مبلغ درخواست‌شده` / `Requested amount`
   - `customerUser.claimRequests.detail.*`:
     - `title`: `جزئیات درخواست خسارت` / `Claim request details`
     - `assessmentItems`: `موارد ارزیابی` / `Assessment items`
   - `customerUser.claimRequests.assessmentItems.*`:
     - `description`: `جزئیات ارزیابی این درخواست خسارت.` / `Assessment details for this claim request.`
     - `empty`: `مورد ارزیابی در دسترس نیست.` / `No assessment items are available.`
     - `status`: `وضعیت` / `Status`
     - `amount`: `مبلغ` / `Amount`

## Implementation Details
1. Add any missing keys to `apps/iap-admin/src/shared/i18n/locales/fa/common.json` and `en/common.json`.
2. Ensure constant mappings maintain strict type safety with `as const satisfies`.
