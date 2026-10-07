# CRM-02 — Page composition and header

## Source evidence

`pages/claim-request-management-page.tsx` mounts, in order: LastStatusSection, AssignSection, RegisteredByAgentSection, QuickButtons; InfoList; left Card with AssessmentItemsSection, DoctorResponses, ReviewSwitcherSection, ManagementError, ObjectionSection, ManagementActionBtn; right AttachmentsSection; optional ManagementPrevRequest when createdBy exists; DocumentsSection. Desktop widths 2/5 and 3/5, medium 1/2 each, small full width. Main uses space-y-2 transparent zero-padding layout.

- [ ] Port `ClaimRequestManagementPage` to target `features/claim-requests/pages/claim-request-management/claim-request-management-page.tsx`, importing small page-exclusive components and public reusable capabilities.
- [ ] Port `claimRequestManagementQueryOptions`/`useClaimRequestManagementData` to target feature `queries/`. Exact key `['claimRequest', claimRequestId]`; getById forwards signal; staleTime/gcTime 10000, focus refetch true. Route loader uses static staleTime and source pendingMs/pendingMinMs 200.
- [ ] Replace only operations route placeholder with thin public feature composition. Existing dynamic directory is already present; no new ID-only directory or child journey.
- [ ] Port pending header/info/assessment/attachments skeletons and query error 404/notFound,500/serverError,generic. Use `cn` for variable skeleton widths instead of source class template.
- [ ] Port LastStatusSection and StatusHistoryDialog/icons. Source helper displays PAID with nullish extPaymentDate as SENT_TO_BANK; latest dialog entry uses parent status. History sorts timestamps descending; labels use displayName/username/id trim fallback. Date format HH:mm yyyy/MM/dd. Preserve disabled empty trigger, outline badge colors and max-height timeline.
- [ ] Port AssignSection: assignedUserId gates assigned label (assignedUserDisplayName → latestAssignementDisplayName → common.notAvailable), else angle-bracket noAssign. Main assignee has independent companyAssessment label.
- [ ] Port RegisteredByAgentSection: displayName + username with parentheses, nullish fallback and hide empty label.
- [ ] Port InfoList wrapper using existing matching InfoListContent/Card. No extDisplayName/extCustomerName/extPlanCaption produces centered Fanavaran fetch. POST `/claim-requests/policy-details/bulk` body claimRequestIds; source toast then awaited refetch; preserve source-specific failure feedback. Mobile tel link, base-claim new-tab management link, conditional UpdateInfoSection for superadmin or role actions with IN_ASSESSMENT/SENT_FAILED, always mounted inquiry button.

## Translation evidence

Existing keys from source: claimRequests.statusHistory.{systemStatus,title,description,user}; status.sentToBank; assignment.{label,noAssign,companyAssessment,registeredByAgent}; common.{notAvailable,loading,errorStatus.notFound,errorStatus.serverError,errorStatus.generic}; messages.{inquiryFanavaranSuccess,inquiryFanavaranError}; actions.{inquiryFanavaranGetData,inquiryFanavaran,viewDetailsAdjustment}. Constant map status keys are reused. Extract Persian values from actual source locale, never write inferred text.

## Acceptance

Verify source order, width classes, query cancellation/options, empty/error handling, status overrides, assignment fallbacks, inquiry pending/success/failure and role gates. Tests must exercise real public primitives where behavior matters. Final completion requires affected tests/typecheck/lint/diff checks; browser and live-backend checks are separate evidence.
