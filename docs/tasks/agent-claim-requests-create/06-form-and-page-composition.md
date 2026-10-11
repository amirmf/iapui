# Task 06: Form Orchestration and Page Composition

## 1. Objective

Implement the complete form orchestration component (`AgentClaimRequestForm`), the page wrapper (`AgentClaimRequestsCreatePage`), and connect them to the thin route in `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/create/index.tsx`.

## 2. Reference Implementation

### `AgentClaimRequestForm`:
- RHF `useForm<AgentClaimRequestFormValues>` with `agentClaimRequestFormSchema(t)` and `defaultValues`.
- `inquiryNationalCode` watch: triggers `agentClaimRequestService.inquiry` query when length is 10 digits.
- Query error handling:
  - If 404 Axios error: opens `AgentClaimRequestAccountNotFoundDialog`.
  - Else: displays global/toast server error.
- Fields:
  1. `AgentClaimRequestInquiryNationalCodeFormField`
  2. `AgentClaimRequestExtPolicyIdFormField`
  3. `AgentClaimRequestExtNationalCodeFormField`
  4. Submit Date `DatePicker` (maxDate: today)
  5. Submit Date Info Alert (`myiap.createClaimPage.submitDateAlertTitle` / `Description`)
  6. Amount `Input` with `numerical numberWithComma`
  7. `AgentClaimRequestFormDocTypes`
  8. Document Guide Info Alert (when `selectedDocType?.documentGuide` is present)
  9. `FileUploader` from `@modules/files` with `onUploadingChange={setIsUploadingFiles}`
- Actions:
  - Submit Button: disabled while pending or uploading.
  - Labels: `form.creating` (pending), `form.uploading` (uploading), or `claimRequests.create`.
- Mutation:
  - Calls `agentClaimRequestService.create({ selectedUserId, claimRequest: { ... } })`.
  - Format submit date as `yyyy-MM-dd`.
  - On success: invalidates `['agentClaimRequests']`, displays success toast, resets form, calls `onSuccess?.()`.

### `AgentClaimRequestsCreatePage`:
- Max width container: `container mx-auto max-w-3xl pb-5`.
- `Card` and `CardContent` enclosing `AgentClaimRequestForm`.
- `onSuccess`: navigates to `/agent/claim-requests/`.

### Thin Route:
- `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/create/index.tsx`:
  - `createFileRoute('/_agent/agent/claim-requests/create/')`
  - `loader: () => ({ crumb: 'createClaim' })`
  - `component: AgentClaimRequestsCreatePage`

## 3. Verification

- Page renders with proper layout.
- Form validation errors appear correctly.
- Submission invokes mutation with correct payload format.
- Navigation triggers upon success.
