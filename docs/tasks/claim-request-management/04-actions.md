# 04 — Management quick actions and confirmations

Status: implemented and verified. Reference root: `/home/sadegh/Android/project/insurance-ui`. Read this task together with the page contract task before implementation. Do not introduce child routes.

## Ownership and dependencies

Use `apps/iap-admin/src/features/claim-request-management/components/quick-buttons/` and `components/action-buttons/` for this single-page feature, retaining every reference exported component name. Keep form contracts in feature `model/`, query/mutation definitions in `queries/`, transport in `services/`, and backend schemas in public `@iap/api-types` domain entry points. Route IDs arrive through the page boundary; components must not hardcode a reference route owner. Use public auth, forms, dialogs, tables and `@iap/ui` primitives; inspect visual equivalence and use `cn` for conditional classes. These paths assume the root feature owner chosen by the page task; reconcile with that task before creating files.

Reference owners are `src/features/claim-requests/components/quick-buttons/index.tsx`, `components/claim-request-management-action-btn.tsx`, `hooks/use-claim-request-roles-actions.ts`, `hooks/use-claim-request-status-assessment.ts`, `src/utils/access-control.ts`, and `src/hooks/use-is-develop-mode.ts`.

## Task 04.1 — Exact permission matrix

Implement `ClaimRequestQuickButtons` in source order. `isAdminRole` includes ADMIN_USER and both SUPER_ADMIN/SUPER_ADMIN_USER. `isRolesActions` means admin OR ASSESSMENT_USER/MAIN_ASSESSMENT_USER OR HQ_USER OR BRANCH_USER. The misleading comment “except admin and superAdmin” is not behavior.

| Component | Mount condition |
| --- | --- |
| ClaimRequestStatusButton | Super admin |
| ClaimRequestReturnInAssessmentButton | Super admin OR rolesActions and RETURN/REJECTED/DELEGATED/DEDICATED_TO_USER/APPROVED |
| ClaimRequestReviewLaterButton | rolesActions and IN_ASSESSMENT |
| ReturnFromPaymentSection | admin/branch/HQ and PAID/SENT |
| ReturnFromPaymentSendAgainSection | admin/branch/HQ and PAID/SENT/PAYMENT_RETURN |
| ClaimRequestAssignToMeButton | rolesActions and IN_ASSESSMENT/DELEGATED |
| ClaimRequestReplayButton | doctor OR super admin, DELEGATED, assignedUserId equals current user id |
| ClaimRequestAssignmentSection | rolesActions (including history-only states) |
| ClaimRequestTaminDrugPrescriptionsSection, ClaimRequestTaminParaClinicPrescriptionsSection, ClaimRequestTaminOfficeServicesSection, ClaimRequestIhioPrescriptionsByPrintCodeSection | develop mode, which is exactly super admin in reference |

`ClaimRequestUpdateInfoSection`, update-doc-type and update-submit-date forms are commented out and outside the mounted closure. Do not enable them. Assignment editing is allowed for super admin or rolesActions with IN_ASSESSMENT/DEDICATED_TO_USER/SENT_FAILED; otherwise show assignment history only.

Acceptance: table-driven role/status checks including both super admin role strings, doctor assignment ownership, history-only assignment and PAYMENT_RETURN resend.

## Task 04.2 — Status, review later, self-assignment

Source files: `components/quick-buttons/claim-request-status-button.tsx`, `claim-request-status-dialog.tsx`, `claim-request-review-later-button.tsx`, `claim-request-return-inAssessment-button.tsx`, `claim-request-assign-to-me-button.tsx` under the reference owner.

Preserve `ClaimRequestStatusDialog`: initially no selection; all options from `getClaimRequestStatusOptions(t)` in `src/constants/claim-status-constant.ts`; reset selection when closed; disable submit without a value or while pending. Arbitrary status change invokes `updateClaim(id,{status})`, closes on success, toasts, then awaits refetch.

Review later immediately patches status DEDICATED_TO_USER, toasts, then awaits refetch. Return to assessment uses destructive confirmation; patches IN_ASSESSMENT, toasts, awaits refetch, then closes confirmation. Self-assignment uses `claimRequest.id`, displays claimIdMissing error when absent, and chooses assignments/me/status with `{claimRequestStatus:'IN_ASSESSMENT'}` only for DELEGATED; otherwise assignments/me with no body. Await refetch before closing. Mutation failure must leave source-held confirmations open.

Acceptance: exact request bodies and method/path, reset/reopen, disabled pending controls, refetch/close sequencing.

## Task 04.3 — Assignment and replay

Source group `components/quick-buttons/claim-request-assignment-section/`: `ClaimRequestAssignmentSection`, `ClaimRequestAssignDialog`, `ClaimRequestAssignForm`. Shared closure: `components/claim-request-assignment-history.tsx`, `components/claim-request-assignee-fields.tsx`, `src/components/select/agreement-search-select.tsx`, `src/components/select/user-account-search-select.tsx` and their actual query/service/schema dependencies.

Assignment assignee precedence is loose `assigneeId` then assignedUserId. Modal max width 4xl, history first, form only if canAssign. Form always targets ROLE_DOCTOR_USER (target switch is commented out). Default agreementId, assigneeId, description are empty; reset on closing. Hide agreement lookup when extPolicyId is a number. Changing agreement clears assigneeId. Pass current user's parentUserAccountId to the user lookup; branchLocationId is not supplied from page in reference. Disable submit when pending/closed/selected assignee equals currently assigned. Do not preselect current assignee. On submit trim description and post DELEGATED; toast, invoke non-awaited onAssigned refetch, close.

Source replay group `components/quick-buttons/claim-request-replay-section/`: `ClaimRequestReplayButton`, `ClaimRequestReplayDialog`, `ClaimRequestReplayForm`; history shared as above. Replay targets last array history entry's assignedByUserId, not a sorted history. Disable trigger when absent; submission absence toasts assignmentError. Description uses trimmed nonempty replay schema. Post assignments with IN_ASSESSMENT, toast, close, `void refetch()`.

Canonical form schemas: `claimRequestAssigneeFieldsFormSchema`, `claimRequestReplayFormSchema` from `data/claim-request-schema.ts`. Assignment description uses nonempty without trimming in validation; trimming happens for transport. Replay trims in validation. Preserve the difference.

Acceptance: lookup query propagation, agreement reset, selected missing option behavior, doctor-only lookup, array-order replay target, failure remains open, non-awaited success refetch.

## Task 04.4 — Payment return and return/resend

Source groups `components/quick-buttons/return-from-payment-section/` and `return-from-payment-send-again-section/`: retain `ReturnFromPaymentSection`, `ReturnFromPaymentDialog`, `ReturnFromPaymentSendAgainSection`, `ReturnFromPaymentSendAgainDialog`. Form contracts `returnFromPaymentFormSchema` / `returnFromPaymentSendAgainFormSchema` require understood=true and trimmed nonempty description, default false/empty. The informational paragraph interleaves outpatientDocAcceptanceExtId with four source locale strings.

Validated form submit opens a second destructive confirmation; confirming reads form.getValues and posts objections body `{claimRequestId,description:trimmed,claimRequestStatus:'PAYMENT_RETURN'|'PAYMENT_RETURN_RESEND',isCheat:'N'}`. Success toast -> form reset -> close confirm -> close dialog -> await onSuccess refetch. Dialog closing while pending is blocked; closing otherwise resets form and confirmation. Failure retains both dialogs.

Acceptance: understood validation, whitespace description validation, exact payload and sequencing, independent dialogs and correct confirmation labels.

## Task 04.5 — Bottom workflow actions

Retain `ClaimRequestManagementActionBtn`, `StartCoreAiWorkflowButton`, `RefreshPolicyDetailsButton` from `components/claim-request-management-action-btn.tsx` and `components/action-buttons/`. Both visible triggers are super-admin-only, gray background with hover gray, right-aligned wrapping footer. Approval trigger is commented out; do not expose it. Start/refresh confirmations close synchronously before mutation, so failure leaves those confirmations closed (different from quick actions).

Start body is `{claimRequestId,workflowId:claimRequestId,initiatedBy}`. initiatedBy chooses trimmed current user id, then trimmed username, then literal system. Service trims all three fields. Success toast maps known returned status via CLAIM_REQUEST_STATUS_TRANSLATION_KEYS, passes unknown strings through and uses coreAiWorkflowStatusUnknown when absent; no refetch. Policy refresh success toasts and awaits refetch. Shared submitDisabled is OR of all three source mutations (including unreachable approval).

## Task 04.6 — Super-admin prescription dialogs

Source `components/quick-buttons/fanhub-tamin-prescription-section/` exports three sections and private `FanhubTaminPrescriptionSection`; dialog `FanhubTaminPrescriptionDialog`; drug group `FanhubTaminDrugPrescription`, `FanhubTaminDrugPrescriptionSkeleton`, `FanhubTaminDrugPrescriptionCard`, `FanhubTaminDrugPrescriptionFinancialDetails`, utility helpers. Read each source before porting. Source `components/quick-buttons/fanhub-ihio-print-code-section/index.tsx` exports `ClaimRequestIhioPrescriptionsByPrintCodeSection` with private `IhioPrintCodeResponse` and `IhioInsuredInfoList`.

Tamin trigger is disabled only when submitDate absent or pending; click also checks extNationalCode. Opening immediately requests nationalCode/extNationalCode and prescriptionDate/submitDate, then opens dialog. Re-inquiry changes nationalCode only. Prevent closing pending dialog. IHIO starts with empty required trimmed printCode; nationalNumber comes from extNationalCode; reset form and mutation when closed. Display insured name,lastName,nationalNumber,birthDate,gender,isCovered and sorted table columns creationDate,partnerName,contractPartyName,licenseName,samadCode,isActive; null/undefined/empty becomes '-'. Preserve error alert and nested response fallbacks.

**Unresolved behavior decision:** `services/fanhub-tamin-service.ts` hardcodes `useFanhubTaminMocks = true`; all four calls return `fanhub-tamin-mock-service.ts` data before reaching HTTP. Ask whether exact mock behavior is intended or real backend inquiry should be explicitly authorized. Do not silently replace it.

## Verified transport dependencies

All following paths are in reference `services/claim-request-service.ts`, `core-ai-service.ts`, `fanhub-tamin-service.ts`; successful claim mutations parse `claimRequestSchema` from `data/claim-request-schema.ts`.

| Method/path | Request schema | Response schema |
| --- | --- | --- |
| PATCH /claim-requests/{id} | source has NO request validation; Partial<ClaimRequest> | claimRequestSchema |
| POST /claim-requests/{id}/policy-details | no body | claimRequestSchema |
| POST /claim-requests/{id}/assignments | assignClaimRequestRequestSchema | claimRequestSchema |
| POST /claim-requests/{id}/assignments/me | no body | claimRequestSchema |
| POST /claim-requests/{id}/assignments/me/status | assignClaimRequestToMeStatusRequestSchema | claimRequestSchema |
| POST /claim-requests/objections | addObjectionRequestSchema | claimRequestSchema |
| POST /core-ai/workflows/data-extraction/start | coreAiDataExtractionRequestSchema | coreAiDataExtractionResponseSchema |
| POST /core-ai/workflows/data-extraction/{encodedWorkflowId}/approve | coreAiWorkflowIdSchema; no body; unreachable trigger | source ignores response |
| POST /claim-requests/fanhub/tamin/drug-prescriptions | fanhubPrescriptionInquiryRequestSchema | fanhubDrugPrescriptionResponseSchema |
| POST /claim-requests/fanhub/tamin/para-clinic-prescriptions | fanhubPrescriptionInquiryRequestSchema | fanhubParaClinicPrescriptionResponseSchema |
| POST /claim-requests/fanhub/tamin/office-services | fanhubPrescriptionInquiryRequestSchema | fanhubOfficeServiceResponseSchema |
| POST /claim-requests/fanhub/ihio/prescriptions-by-print-code | fanhubIhioPrintCodeInquiryRequestSchema | fanhubIhioPrintCodeInquiryResponseSchema |

Core AI schemas live in `data/core-ai-schema.ts`; prescription schemas including all nested response objects live in `data/fanhub-tamin-prescription-schema.ts`. Keep exact export names and accepted values.

**Architecture conflict:** assignClaimRequestRequestSchema, assignClaimRequestToMeStatusRequestSchema and addObjectionRequestSchema are `.loose()` requests, while current architecture requires strict requests. PATCH has no schema. Resolve request semantics with user before tightening; package ownership still follows architecture. No-body endpoint boundaries need explicit target schemas without fabricating server response objects.

## Translation evidence and final checks

The following literal translation keys are extracted from mounted quick-button/action source files. Copy values from reference `src/locales/fa.json`/`en.json`; audit tenant overrides separately. Dynamic status keys come from the existing centralized constant; dynamic prescription keys must expand all actual types/fields. Preserve common.cancel fallback 'Cancel' where supplied. Do not copy translations used only by disabled update-info forms.

- `claimRequests.actions.assignToMe`
- `claimRequests.actions.refreshPolicyDetails`
- `claimRequests.actions.returnInAssessment`
- `claimRequests.actions.reviewLater`
- `claimRequests.actions.selectedStatusChange`
- `claimRequests.actions.startCoreAiWorkflow`
- `claimRequests.actions.statusChange`
- `claimRequests.assignment.assignButton`
- `claimRequests.assignment.assignButtonDialog`
- `claimRequests.assignment.dialogDescription`
- `claimRequests.assignment.history.title`
- `claimRequests.assignment.submitting`
- `claimRequests.assignment.title`
- `claimRequests.confirmations.approveCoreAiWorkflow.description`
- `claimRequests.confirmations.approveCoreAiWorkflow.title`
- `claimRequests.confirmations.assignToMe.description`
- `claimRequests.confirmations.assignToMe.title`
- `claimRequests.confirmations.refreshPolicyDetails.description`
- `claimRequests.confirmations.refreshPolicyDetails.title`
- `claimRequests.confirmations.returnInAssessment.description`
- `claimRequests.confirmations.returnInAssessment.title`
- `claimRequests.confirmations.startCoreAiWorkflow.description`
- `claimRequests.confirmations.startCoreAiWorkflow.title`
- `claimRequests.ihioPrintCode.action`
- `claimRequests.ihioPrintCode.description`
- `claimRequests.ihioPrintCode.empty`
- `claimRequests.ihioPrintCode.fields.printCode`
- `claimRequests.ihioPrintCode.missingClaimData`
- `claimRequests.ihioPrintCode.submit`
- `claimRequests.ihioPrintCode.title`
- `claimRequests.ihioPrintCode.validation.printCode`
- `claimRequests.messages.assignmentError`
- `claimRequests.messages.assignmentSuccess`
- `claimRequests.messages.claimIdMissing`
- `claimRequests.messages.coreAiWorkflowApproved`
- `claimRequests.messages.coreAiWorkflowStarted`
- `claimRequests.messages.coreAiWorkflowStatusUnknown`
- `claimRequests.messages.policyDetailsUpdated`
- `claimRequests.messages.returnInAssessmentSuccess`
- `claimRequests.messages.reviewLaterSuccess`
- `claimRequests.messages.statusChangeSuccess`
- `claimRequests.replay.button`
- `claimRequests.replay.description`
- `claimRequests.replay.descriptionPlaceholder`
- `claimRequests.replay.title`
- `claimRequests.returnFromPayment.actions.button`
- `claimRequests.returnFromPayment.actions.submit`
- `claimRequests.returnFromPayment.confirm.confirm`
- `claimRequests.returnFromPayment.confirm.description`
- `claimRequests.returnFromPayment.confirm.title`
- `claimRequests.returnFromPayment.fields.description`
- `claimRequests.returnFromPayment.fields.understood`
- `claimRequests.returnFromPayment.messages.success`
- `claimRequests.returnFromPayment.temporaryDescription1`
- `claimRequests.returnFromPayment.temporaryDescription2`
- `claimRequests.returnFromPayment.temporaryDescription3`
- `claimRequests.returnFromPayment.temporaryDescription4`
- `claimRequests.returnFromPayment.title`
- `claimRequests.returnFromPayment.validation.description`
- `claimRequests.returnFromPayment.validation.understood`
- `claimRequests.returnFromPaymentSendAgain.actions.button`
- `claimRequests.returnFromPaymentSendAgain.actions.submit`
- `claimRequests.returnFromPaymentSendAgain.confirm.confirm`
- `claimRequests.returnFromPaymentSendAgain.confirm.description`
- `claimRequests.returnFromPaymentSendAgain.confirm.title`
- `claimRequests.returnFromPaymentSendAgain.fields.description`
- `claimRequests.returnFromPaymentSendAgain.fields.understood`
- `claimRequests.returnFromPaymentSendAgain.messages.success`
- `claimRequests.returnFromPaymentSendAgain.temporaryDescription1`
- `claimRequests.returnFromPaymentSendAgain.temporaryDescription2`
- `claimRequests.returnFromPaymentSendAgain.temporaryDescription3`
- `claimRequests.returnFromPaymentSendAgain.temporaryDescription4`
- `claimRequests.returnFromPaymentSendAgain.title`
- `claimRequests.returnFromPaymentSendAgain.validation.description`
- `claimRequests.returnFromPaymentSendAgain.validation.understood`
- `claimRequests.taminPrescriptions.description`
- `claimRequests.taminPrescriptions.drugEmpty`
- `claimRequests.taminPrescriptions.drugQuantity`
- `claimRequests.taminPrescriptions.empty`
- `claimRequests.taminPrescriptions.fields.docName`
- `claimRequests.taminPrescriptions.fields.drgUsg`
- `claimRequests.taminPrescriptions.fields.druqAmt`
- `claimRequests.taminPrescriptions.fields.insurancePayment`
- `claimRequests.taminPrescriptions.fields.nationalCode`
- `claimRequests.taminPrescriptions.fields.patientID`
- `claimRequests.taminPrescriptions.fields.patientName`
- `claimRequests.taminPrescriptions.fields.phaPrice`
- `claimRequests.taminPrescriptions.fields.phaRequestPrice`
- `claimRequests.taminPrescriptions.fields.prescDate`
- `claimRequests.taminPrescriptions.fields.specDesc`
- `claimRequests.taminPrescriptions.fields.ssoPayment`
- `claimRequests.taminPrescriptions.financialSummary`
- `claimRequests.taminPrescriptions.missingServiceDate`
- `claimRequests.taminPrescriptions.submit`
- `claimRequests.taminPrescriptions.totalInsurancePayment`
- `claimRequests.taminPrescriptions.totalPhaPrice`
- `claimRequests.taminPrescriptions.totalPhaRequestPrice`
- `claimRequests.taminPrescriptions.totalSsoPayment`
- `claimRequests.taminPrescriptions.validation.nationalCodeLength`
- `claimRequests.taminPrescriptions.validation.nationalCodeRequired`
- `common.cancel`
- `common.dialog.cancel`
- `common.loading`
- `common.notAvailable`
- `common.submit`
- `errors.general.description`
- `errors.general.heading`

Before completing: affected contract/request tests, form/permission behavior tests, typecheck, lint, diff whitespace check. Record browser rendering and live-backend checks separately from unit tests. This audit does not claim browser or live-backend parity.

## Implementation decisions (user confirmed)

Preserve FanHub mock responses. Enforce strict backend requests while retaining exact source fields, endpoint names and response acceptance. Actual owner is `features/claim-requests/pages/claim-request-management/components/`. Update-info is commented out in the quick toolbar but IS mounted in `ClaimRequestInfoList`; include its two forms. Reuse existing InfoListContent and document types capabilities.
