# TASK-02: Localization and Constants

Status: Completed

## Goal
Add exact reference Persian translations to `apps/iap-admin/src/shared/i18n/locales/fa/common.json` and define clean status/badge presentation constants in `apps/iap-admin/src/features/pipelines/constants/pipeline-constant.ts`.

## Reference Source
- Translations: `insurance-ui/src/locales/fa.json` (section `"pipelines"`)
- Variant / Badge logic: `insurance-ui/src/features/pipelines/components/pipeline-executions-table.tsx` (`statusVariant` & `executionIdKeys`)

## Target File Locations
- `apps/iap-admin/src/shared/i18n/locales/fa/common.json`
- `apps/iap-admin/src/features/pipelines/constants/pipeline-constant.ts`
- `apps/iap-admin/src/features/pipelines/constants/pipeline-constant.test.ts`

## Details

### 1. Localization Strings (`common.json`)
Under `"pipelines"`:
```json
{
  "title": "خطوط پردازش",
  "description": "کارهای گزارش‌گیری را پایش کنید، فراداده اجرای آن‌ها را ببینید و اجراها را مدیریت کنید.",
  "jobsTitle": "کارها",
  "executionsTitle": "تاریخچه اجرا",
  "executionsDescription": "اجراهای {{jobName}}",
  "selectJob": "برای مشاهده اجراها یک کار را انتخاب کنید.",
  "loadingJobs": "در حال دریافت کارها...",
  "loadingExecutions": "در حال دریافت اجراها...",
  "emptyJobs": "هیچ کار خط پردازشی در دسترس نیست.",
  "emptyExecutions": "برای این کار اجرایی وجود ندارد.",
  "columns": {
    "job": "کار",
    "executionId": "شناسه اجرا",
    "status": "وضعیت",
    "startedAt": "شروع",
    "endedAt": "پایان",
    "details": "جزئیات",
    "actions": "عملیات"
  },
  "actions": {
    "refresh": "به‌روزرسانی",
    "start": "شروع",
    "stop": "توقف",
    "restart": "اجرای مجدد",
    "viewDetails": "مشاهده جزئیات"
  },
  "errors": {
    "jobs": "دریافت کارهای خط پردازش ناموفق بود.",
    "executions": "دریافت اجراها ناموفق بود."
  },
  "messages": {
    "started": "کار خط پردازش شروع شد.",
    "stopped": "اجرای خط پردازش متوقف شد.",
    "restarted": "اجرای خط پردازش مجدداً شروع شد."
  },
  "stopDialog": {
    "title": "توقف اجرای خط پردازش",
    "description": "آیا از توقف این اجرای خط پردازش مطمئن هستید؟"
  }
}
```

### 2. Constant File (`pipeline-constant.ts`)
In the reference project, execution statuses are arbitrary string responses from Spring Batch (`COMPLETED`, `STARTING`, `STARTED`, `STOPPING`, `STOPPED`, `FAILED`, `ABANDONED`, `UNKNOWN`) rather than a fixed enum dictionary.
To preserve clean code and project architecture:
- `PIPELINE_EXECUTION_ID_KEYS = ['executionId', 'id'] as const`
- `getPipelineExecutionStatusVariant(status: string): 'destructive' | 'secondary' | 'outline'`
  - Normalizes status to uppercase.
  - Matches `'FAIL'` or `'STOP'` -> `'destructive'`.
  - Matches `'COMPLETE'` or `'SUCCESS'` -> `'secondary'`.
  - Default -> `'outline'`.

## Acceptance Criteria
- Persian strings match reference `fa.json` with 100% character-for-character parity.
- `pipeline-constant.ts` encapsulates the status variant logic and execution ID keys.
- Unit tests in `pipeline-constant.test.ts` verify all variant conditions and edge cases.
