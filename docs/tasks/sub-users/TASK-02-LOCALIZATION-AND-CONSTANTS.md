# TASK-02: Localization and Constants

## Objective
Add all `subUsers` Persian translation keys to `apps/iap-admin/src/shared/i18n/locales/fa/common.json` and create the feature constants in `apps/iap-admin/src/features/sub-users/constants/sub-user-constant.ts`.

## Reference Source
- `insurance-ui/src/locales/fa.json` (`subUsers`)
- `insurance-ui/src/constants/party-constant.ts`
- `insurance-ui/src/features/sub-users/components/sub-user-columns.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-form-dialog.tsx`

## Implementation Target
1. `apps/iap-admin/src/shared/i18n/locales/fa/common.json` (add `"subUsers": { ... }`)
2. `apps/iap-admin/src/features/sub-users/constants/sub-user-constant.ts`

## Detailed Specifications

### 1. Translations (`common.json`)
The complete `subUsers` translation tree from reference `fa.json`:
- `title`: `"ارزیابان من"`
- `empty`: `"کاربر زیرمجموعه‌ای یافت نشد."`
- `columns`: `username`, `displayName`, `mobileNumber`, `email`, `roles`, `status`, `actions`
- `filters`: `textFilter`, `username`, `displayName`, `mobileNumber`
- `status`: `enabled`: `"فعال"`, `disabled`: `"غیرفعال"`
- `actions`: `refresh`, `create`, `details`, `edit`, `enable`, `disable`, `releaseAssignments`
- `details`: `title`: `"جزئیات کاربر زیرمجموعه"`
- `form`: `createTitle`, `editTitle`, `createDescription`, `editDescription`, `username`, `password`, `firstName`, `lastName`, `roles`, `docTypes`, `docTypesPlaceholder`
- `messages`: `saveSuccess`, `saveError`, `statusUpdateSuccess`, `statusUpdateError`, `releaseAssignmentsSuccess`, `userIdMissing`
- `validation`: `username`, `password`, `email`, `mobileNumber`, `docTypeCodes`, `roles`, `partyFname`, `partyLname`
- `releaseAssignments`: `title`, `description`, `confirm`

### 2. Feature Constants (`sub-user-constant.ts`)
```ts
export const DOCTOR_USER_ROLE = 'ROLE_DOCTOR_USER'

export const subUserStatusColors: Record<'enabled' | 'disabled', string> = {
  enabled: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  disabled: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
}

export function getSubUserRoleOptions(t: TFunction) {
  return [
    {
      value: 'ROLE_REQUEST_REGISTERY_AGENT',
      label: t('parties.role.requestRegisteryAgent'),
    },
    {
      value: 'ROLE_ASSESSMENT_USER',
      label: t('parties.role.assessmentUser'),
    },
    {
      value: DOCTOR_USER_ROLE,
      label: t('parties.role.doctorUser'),
    },
  ]
}
```

## Acceptance Criteria
- [ ] Every key from reference `subUsers` is present in `common.json`.
- [ ] Persian values match reference without modifications.
- [ ] Centralized enum and color constants with type-safety.
