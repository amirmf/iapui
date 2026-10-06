# TASK-02: Localization and Enum Constants

## Objective
Add the exact Persian translation namespace in `apps/iap-admin` and create the centralized enum translation constant and styling helper for assignment rule statuses.

## Reference Source
- `insurance-ui/src/locales/fa.json` (`assignementRules.*`)
- `insurance-ui/src/locales/en.json` (`assignementRules.*`)
- Target patterns in `apps/iap-admin/src/features/agreements/constants/` and `apps/iap-admin/src/features/coverages/constants/`

## Implementation Target
1. `apps/iap-admin/src/shared/i18n/locales/fa/common.json`
2. `apps/iap-admin/src/features/assignement-rules/constants/assignement-rule-constant.ts`

## 1. Localization Dictionary (`common.json`)
The complete `assignementRules` key structure ported from the reference:

```json
"assignementRules": {
  "title": "قوانین ارجاع",
  "empty": "هیچ قانون ارجاعی یافت نشد.",
  "actions": {
    "create": "ایجاد قانون ارجاع",
    "edit": "ویرایش قانون ارجاع",
    "delete": "حذف قانون ارجاع",
    "refresh": "بروزرسانی"
  },
  "dialog": {
    "create": "ایجاد قانون ارجاع",
    "edit": "ویرایش قانون ارجاع",
    "delete": "حذف قانون ارجاع",
    "deleteDescription": "آیا از حذف این قانون ارجاع مطمئن هستید؟"
  },
  "fields": {
    "title": "عنوان",
    "docTypeCode": "کد نوع سند",
    "assignee": "نام کاربری ارزیاب",
    "status": "وضعیت",
    "policyId": "بیمه‌نامه",
    "contractId": "شناسه قرارداد",
    "workUnit": "کد شعبه",
    "amountMin": "حداقل مبلغ",
    "amountMax": "حداکثر مبلغ",
    "amountApprovedMin": "حداقل مبلغ تاییدشده",
    "amountApprovedMax": "حداکثر مبلغ تاییدشده",
    "fromDate": "تاریخ شروع",
    "thruDate": "تاریخ پایان"
  },
  "columns": {
    "title": "عنوان",
    "docTypeCode": "نوع سند",
    "assignee": "ارزیاب",
    "workUnit": "شعبه",
    "status": "وضعیت"
  },
  "status": {
    "active": "فعال",
    "inactive": "غیرفعال"
  },
  "bulkDelete": {
    "button": "حذف انتخاب‌شده‌ها",
    "title": "حذف قوانین انتخاب‌شده",
    "description": "آیا از حذف {{count}} قانون ارجاع انتخاب‌شده مطمئن هستید؟"
  },
  "messages": {
    "created": "قانون ارجاع با موفقیت ایجاد شد.",
    "updated": "قانون ارجاع با موفقیت ویرایش شد.",
    "deleted": "قانون ارجاع با موفقیت حذف شد.",
    "createFailed": "ایجاد قانون ارجاع ناموفق بود.",
    "updateFailed": "ویرایش قانون ارجاع ناموفق بود.",
    "deleteFailed": "حذف قانون ارجاع ناموفق بود.",
    "bulkDeleted": "قوانین ارجاع انتخاب‌شده با موفقیت حذف شدند.",
    "bulkDeleteFailed": "حذف قوانین ارجاع انتخاب‌شده ناموفق بود."
  },
  "errors": {
    "titleRequired": "عنوان الزامی است."
  }
}
```

## 2. Enum Constant File (`assignement-rule-constant.ts`)
Location: `apps/iap-admin/src/features/assignement-rules/constants/assignement-rule-constant.ts`

```ts
import type { AssignementRuleStatus } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const ASSIGNEMENT_RULE_STATUS_TRANSLATION_KEYS: Record<
  AssignementRuleStatus,
  `assignementRules.status.${string}`
> = {
  ACTIVE: 'assignementRules.status.active',
  INACTIVE: 'assignementRules.status.inactive',
}

export const assignementRuleStatusTranslationKeys =
  ASSIGNEMENT_RULE_STATUS_TRANSLATION_KEYS

export const assignementRuleStatusBadgeColors: Record<
  AssignementRuleStatus,
  string
> = {
  ACTIVE: 'border-emerald-200 text-emerald-700',
  INACTIVE: 'border-slate-200 text-slate-600',
}

export function getAssignementRuleStatusOptions(
  t: TFunction
): Array<{ label: string; value: AssignementRuleStatus }> {
  return (['ACTIVE', 'INACTIVE'] as const).map((status) => ({
    label: t(assignementRuleStatusTranslationKeys[status] as never),
    value: status,
  }))
}
```

## Acceptance Criteria
- [ ] Persian translations added to `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
- [ ] No English/Persian mismatch; identical keys to reference project.
- [ ] Centralized enum translation map and status options helper created in `constants/assignement-rule-constant.ts`.
- [ ] Unit test added to verify options mapping against i18n keys.
