# Task 07: Locales & Translations Parity

## Reference

- `insurance-ui/src/locales/fa.json`
- `insurance-ui/src/locales/en.json`
- `apps/iap-admin/src/shared/i18n/locales/fa/common.json`

## Deliverables

Ensure all translation keys referenced in the new layout components exist in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`:

1. **Auth & Loading Keys**:
   - `auth.login.loading`: `"در حال بارگذاری..."`

2. **Common & Theme Keys**:
   - `common.signOut`: `"خروج"`
   - `common.theme.toggle`: `"تغییر تم"`
   - `common.theme.light`: `"روشن"`
   - `common.theme.dark`: `"تیره"`
   - `common.theme.system`: `"سیستم"`

3. **Breadcrumb Keys**:
   - `breadcrumb.home`: `"خانه"`

4. **System Keys**:
   - `system.assessment`: `"ارزیابی"`

5. **Command Palette Keys**:
   - `command.placeholder`: `"دستور یا عبارت مورد نظر را جستجو کنید..."`
   - `command.noResults`: `"نتیجه‌ای یافت نشد."`
   - `command.theme`: `"تم"`

6. **Sidebar Navigation Keys (`sidebar.*`)**:
   Verify every item from `useSidebarData`:
   - `sidebar.dashboard`
   - `sidebar.claimRequests`
   - `sidebar.medicalCenter`
   - `sidebar.tickets`
   - `sidebar.supportQuestions`
   - `sidebar.agreements`
   - `sidebar.subUsers`
   - `sidebar.parties`
   - `sidebar.bankAccounts`
   - `sidebar.assessmentPrompts`
   - `sidebar.aiAssessmentRules`
   - `sidebar.repetitiveResponses`
   - `sidebar.coverages-maxa`
   - `sidebar.specialDiseases`
   - `sidebar.personSpecialDiseases`
   - `sidebar.branches`
   - `sidebar.damageCodes`
   - `sidebar.assignementRules`
   - `sidebar.docTypes`
   - `sidebar.otp`
   - `sidebar.claimReports`
   - `sidebar.pipelines`
   - `sidebar.outpatientDocAcceptances`

## Verification Criteria

- No missing translation warnings or raw translation keys displayed in UI.
- All Persian translations match `insurance-ui` source values.
