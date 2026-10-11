# Task 01: Translations and Constants Parity

## 1. Objective

Ensure all required translation keys and enum constants match the reference implementation in `insurance-ui` exactly, both in Persian (`apps/iap-admin/src/shared/i18n/locales/fa/common.json`) and in English (`apps/iap-admin/src/shared/i18n/locales/en/common.json`).

## 2. Reference Audit

### Translation Keys Required by Create Form Components:

1. **Inquiry Field**:
   - `agent.claimRequests.create.fields.inquiryNationalCode` ("کد ملی کاربر" / "User national code")
   - `agent.claimRequests.create.fields.inquiryNationalCodePlaceholder` ("کد ملی را وارد کنید" / "Enter national code")
   - `agent.claimRequests.create.fields.selectedNationalCode` ("کاربر انتخاب شده" / "Selected user")
2. **Inquiry Validation**:
   - `agent.claimRequests.create.validation.inquiryNationalCodeRequired` ("کد ملی برای استعلام الزامی است" / "National code is required for inquiry")
   - `agent.claimRequests.create.validation.inquiryNationalCodeLength` ("کد ملی باید ۱۰ رقم باشد" / "National code must be 10 digits")
3. **Account Not Found Dialog**:
   - `agent.claimRequests.create.accountNotFound.title` ("حساب کاربری برای شخص موردنظر یافت نشد." / "Account not found for the specified person.")
   - `agent.claimRequests.create.accountNotFound.description1` ("برای ایجاد حساب کاربری بیمه‌شده، روی گزینه" / "To create an account for the insured person, click on ")
   - `agent.claimRequests.create.accountNotFound.description2` (" «ثبت‌نام بیمه‌شده» " / " \"Register Insured\" ")
   - `agent.claimRequests.create.accountNotFound.description3` ("کلیک کرده و اطلاعات لازم را وارد کنید." / "and enter the required information.")
   - `agent.claimRequests.create.accountNotFound.understood` ("متوجه شدم" / "Understood")
   - `agent.claimRequests.create.accountNotFound.registerInsured` ("ثبت‌نام بیمه‌شده" / "Register insured")
4. **General Claim Requests Fields**:
   - `claimRequests.dialog.fields.insurancePolicy` ("انتخاب بیمه‌نامه" / "Select Insurance Policy")
   - `claimRequests.dialog.fields.selectInsurancePolicy` ("انتخاب بیمه‌نامه" / "Select insurance policy")
   - `claimRequests.dialog.fields.subInsuredPerson` ("انتخاب بیمه شده جهت ثبت هزینه درمانی" / "Select insured person for medical expense")
   - `claimRequests.dialog.fields.foreign` ("اتباع" / "Foreign")
   - `claimRequests.dialog.fields.selectSubInsuredPerson` ("انتخاب بیمه شده جهت ثبت هزینه درمانی" / "Select insured person for medical expense")
   - `claimRequests.dialog.fields.submitDate` ("تاریخ انجام هزینه درمانی" / "Treatment date")
   - `claimRequests.dialog.fields.submitDatePlaceholder` ("تاریخ انجام هزینه درمانی را انتخاب کنید" / "Select treatment date")
   - `claimRequests.dialog.fields.amount` ("مبلغ" / "Amount")
   - `claimRequests.dialog.fields.docType` ("نوع سند" / "Document type")
   - `claimRequests.dialog.fields.selectDocType` ("انتخاب نوع سند" / "Select document type")
   - `claimRequests.dialog.fields.attachments` ("پیوست‌ها" / "Attachments")
5. **Alerts & Guides**:
   - `myiap.createClaimPage.submitDateAlertTitle` ("لطفاً به نکته زیر توجه کنید" / "Please note the following")
   - `myiap.createClaimPage.submitDateAlertDescription` ("درخواست ها باید به تفکیک تاریخ انجام هزینه جداگانه ثبت شود." / "Requests must be submitted separately for each service date.")
   - `myiap.docTypeAlert` ("راهنمای سند {{docType}}" / "Document guide {{docType}}")
6. **Form Validation Messages**:
   - `claimRequests.validation.submitDateRequired` ("تاریخ انجام هزینه درمانی الزامی است" / "Treatment date is required")
   - `claimRequests.validation.amountRequired` ("مبلغ الزامی است" / "Amount is required")
   - `claimRequests.validation.attachmentsRequired` ("حداقل یک پیوست الزامی است" / "At least one attachment is required")
   - `claimRequests.validation.docTypeRequired` ("انتخاب نوع سند الزامی است" / "Document type is required")
   - `claimRequests.validation.subInsuredPersonRequired` ("انتخاب شخص تحت پوشش الزامی است" / "Selecting the covered person is required")
   - `claimRequests.validation.insurancePolicyRequired` ("انتخاب بیمه‌نامه الزامی است" / "Selecting an insurance policy is required")
7. **Buttons & Actions**:
   - `form.creating` ("در حال ایجاد..." / "Creating...")
   - `form.uploading` ("در حال بارگذاری..." / "Uploading...")
   - `claimRequests.create` ("ثبت درخواست" / "Submit request")
   - `claimRequests.messages.created` ("درخواست با موفقیت ثبت شد" / "Request created successfully")
   - `common.rial` ("ریال" / "Rial")
   - `createClaim` ("ثبت درخواست خسارت" / "Create claim")

## 3. Constants Review

Inspect `apps/iap-admin/src/features/agent-claim-requests/model/agent-claim-request-constant.ts` to ensure consistency with enum definitions and status maps.
No additional enum constants are introduced specifically for creation; standard `ClaimRequestYesNo` ('Y' | 'N') is already handled.

## 4. Verification

Run localization checks or inspect json keys to guarantee zero missing keys in both `fa` and `en` locales.
