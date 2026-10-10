# Task 01: Translations and Constants

## Context
`insurance-ui` defines translations for `myiap.myIapPage` and `myiap.myBankAccount` in `src/locales/fa.json` and enums/constants in `src/constants/` and `src/features/my-iap/claim-requests/constants/`.

## Requirements
1. **Localization Keys (`apps/iap-app/src/shared/i18n/locales/fa/common.json`)**:
   - Add full `myiap.myIapPage`:
     - `createSpecialDiseaseTitle`: `"ثبت درخواست بیماری‌های خاص"`
     - `createSpecialDiseaseDescription`: `"ثبت درخواست جدید برای بیماری‌های خاص"`
     - `mySpecialDiseasesTitle`: `"درخواست‌های بیماری‌های خاص من"`
     - `mySpecialDiseasesDescription`: `"مشاهده و پیگیری درخواست‌های بیماری‌های خاص"`
     - `myClaimsTitle`: `"پیگیری خسارت"`
     - `myClaimsDescription`: `"مشاهده و مدیریت درخواست‌های خسارت"`
     - `createClaimTitle`: `"بارگذاری مدارک درمانی"`
     - `createClaimDescription`: `"ثبت درخواست خسارت جدید"`
     - `guest`: `"مهمان"`
     - `welcomeTitle`: `"خوش آمدید، {{name}}!"`
     - `welcomeDescription`: `"به پورتال بیمه و خسارت خود خوش آمدید. این مرکز مدیریت تمامی درخواست‌های خسارت بیمه شما می‌باشد."`
     - `panelIntroduction`: `"در اینجا می‌توانید درخواست‌های موجود خود را مشاهده کنید، وضعیت آن‌ها را پیگیری نمایید، درخواست‌های جدید ثبت کنید و به تمام مدارک لازم دسترسی داشته باشید. فرآیند ساده‌شده ما اطمینان می‌دهد که درخواست‌های شما به صورت کارآمد و شفاف پردازش شوند."`
     - `watchTutorial`: `"مشاهده ویدیو آموزشی"`
     - `contractingPartyCenters`: `"مراکز طرف قرارداد"`
     - `medicalReferralLetters`: `"معرفی نامه های درمانی"`
     - `bankAccountInfo`: `"اطلاعات حساب بانکی"`
     - `downloadPolicyPdf`: `"دانلود تعهدات بیمه"`
     - `supportAlertTitle`: `"شماره پشتیبانی"`
     - `supportAlertDescription`: `"پشتیبانی مرکز خدمات حوزه عملیه: 1574"`
   - Add full `myiap.myBankAccount`:
     - `dialog.title`: `"ثبت شماره شبا"`
     - `dialog.description`: `"برای ادامه ثبت خسارت، شماره شبا خود را ثبت یا ویرایش کنید."`
     - `dialog.accountName1`: `"شماره شبا باید به نام"`
     - `dialog.accountName2`: `"باشد."`
     - `fields.type`: `"نوع شماره حساب"`
     - `fields.typePlaceholder`: `"نوع شماره حساب را انتخاب کنید"`
     - `fields.bankName`: `"بانک"`
     - `fields.number`: `"شماره شبا (بدون IR)"`
     - `fields.numberPlaceholder`: `"شماره شبا را وارد کنید"`
     - `types.IBAN`: `"شبا"`
     - `types.CARD`: `"کارت"`
     - `messages.saved`: `"شماره شبا با موفقیت ذخیره شد."`
     - `messages.numberRequired`: `"شماره شبا الزامی است."`
     - `messages.numberError`: `"شماره شبا به صورت صحیح وارد کنید."`
     - `messages.temporaryIbanError`: `"به دلیل مشکلات پیش آمده در سیستم بانکی کشور در حال حاضر شماره شبای بانک‌های ملی، صادرات و توسعه صادرات پشتیبانی نمی‌شود."`
     - `actions.create`: `"ثبت"`
     - `actions.edit`: `"ویرایش"`
     - `actions.saving`: `"در حال ذخیره"`
   - Restore missing `myiap.preAuths` translations to prevent TS errors in existing features.
   - Sync tenant files: `tenants/alborz/locales/fa.json` and `tenants/dana/locales/fa.json`.

2. **Feature Constants (`apps/iap-app/src/features/home/constants/`)**:
   - `policy-pdf-ids.ts`:
     - `export const policyPdfIds: readonly number[] = [41245888]`
     - `export function hasPolicyPdf(policyId: number): boolean`
   - `hoze-support-policy-ids.ts`:
     - Set of 35 policy IDs from reference `src/features/my-iap/claim-requests/hooks/use-has-hoze-support-policy-ids.ts`.
     - `export function isHozeSupportPolicyId(policyId: number): boolean`
   - `bank-account-constant.ts`:
     - `export const BANK_ACCOUNT_TYPE_TRANSLATION_KEYS: Record<BankAccountType, string>`
     - `export const iranianIbanBanks: Record<string, string>` (38 bank codes mapped to Persian bank names)
     - `export const temporarilyIgnoreIbanBankCodes: readonly string[]` ('062', '065', '079', '073', '052', '063')
