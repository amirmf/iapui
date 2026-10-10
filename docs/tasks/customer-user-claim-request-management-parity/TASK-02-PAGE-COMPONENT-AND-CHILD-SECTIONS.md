# Task 02 — Page Component and Child Sections

## Objective
Implement `CustomerUserClaimRequestManagementPage` in `apps/iap-admin/src/features/customer-user/pages/claim-request-management/customer-user-claim-request-management-page.tsx` with exact parity to reference `insurance-ui/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx`.

## Reference Inspection
File: `insurance-ui/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx`
- Extracts `claimRequestId` using `useParams` from `/_customer-user/customer-user/claim-requests/$claimRequestId/claim-request-management/`.
- Queries claim request data using `useCustomerUserClaimRequest(claimRequestId)`.
- Renders `ClaimRequestManagementPending` on loading.
- Renders `ClaimRequestManagementQueryError` on error or empty claim request.
- Extracts `documents` from `claimRequest.documents` and `filteredAttachements` from `claimRequest.attachments`.
- Renders layout container `<Main className='space-y-4 bg-transparent p-0 shadow-none sm:p-0'>`.
- Composes:
  1. Status & assignment bar:
     - `ClaimRequestLastStatusSection` with `statusHistory`, `status`, and `extPaymentDate`.
     - `ClaimRequestAssignSection` with `claimRequest`.
  2. Info list:
     - `ClaimRequestInfoList` with `data={claimRequest}`, `refetch={refetch}`, and `viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management'`.
  3. Assessment & Objection card + Attachments:
     - Card containing:
       - `ClaimRequestAssessmentItemsSection` with `claimRequest` and `claimRequestId`.
       - `ClaimRequestDoctorResponses` with `claimRequest.assignmentHistory`.
       - `ClaimRequestDuplicatedSection` with `claimRequest`.
       - `ClaimRequestManagementError` with `claimRequest`.
       - `ClaimRequestObjectionSection` with `claimRequest`, `claimRequestId`, and `refetch`.
     - `ClaimRequestAttachmentsSection` with `attachments={filteredAttachements}`.
  4. History:
     - `ClaimRequestManagementPrevRequest` when `claimRequest.createdBy` is present.
  5. Documents:
     - `ClaimRequestDocumentsSection` with `claimRequestId` and `documents`.

## Implementation Details
1. Target file: `apps/iap-admin/src/features/customer-user/pages/claim-request-management/customer-user-claim-request-management-page.tsx`.
2. Reuse tested existing child components:
   - `ClaimRequestAssessmentItemsSection` from `@features/assessment-items`
   - `ClaimRequestAssignSection` from `@features/claim-requests`
   - `ClaimRequestAttachmentsSection` from `@features/claim-requests`
   - `ClaimRequestDoctorResponses` from `@features/claim-requests`
   - `ClaimRequestDocumentsSection` from `@features/claim-requests`
   - `ClaimRequestInfoList` from `@features/claim-requests`
   - `ClaimRequestLastStatusSection` from `@features/claim-requests`
   - `ClaimRequestManagementError` from `@features/claim-requests`
   - `ClaimRequestManagementPending` from `@features/claim-requests`
   - `ClaimRequestManagementPrevRequest` from `@features/claim-requests`
   - `ClaimRequestManagementQueryError` from `@features/claim-requests`
   - `ClaimRequestObjectionSection` from `@features/claim-requests`
   - `ClaimRequestDuplicatedSection` from `@features/claim-requests`
3. Export from `apps/iap-admin/src/features/customer-user/index.ts`.
