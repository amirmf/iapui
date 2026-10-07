# Task 03: Page Composition and Subcomponents

## Objective

Implement `AgentClaimRequestManagement` component in `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-request-management.tsx` with exact line-by-line parity to `insurance-ui` (`src/features/agent-claim-requests/pages/agent-claim-request-management.tsx`).

## Component Layout Structure

```tsx
<Main className='space-y-4 bg-transparent p-0 shadow-none sm:p-0'>
  {/* Header Section */}
  <div className='flex flex-wrap items-center gap-3'>
    <ClaimRequestLastStatusSection
      statusHistory={claimRequest.statusHistory || []}
      status={claimRequest.status}
      extPaymentDate={claimRequest.extPaymentDate}
    />
    <ClaimRequestAssignSection claimRequest={claimRequest} />
  </div>

  {/* Info List */}
  <ClaimRequestInfoList
    data={claimRequest}
    refetch={refetch}
    viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management/'
  />

  {/* Two-Column Details */}
  <div className='-mx-2 flex flex-wrap pb-4'>
    {/* Left Column (Assessments, Responses, Duplicates, Objections) */}
    <div className='w-full px-2 md:w-1/2 lg:w-2/5'>
      <Card>
        <CardContent className='px-4'>
          <ClaimRequestAssessmentItemsSection
            claimRequest={claimRequest}
            claimRequestId={claimRequestId}
          />
          <ClaimRequestDoctorResponses
            assignmentHistory={claimRequest.assignmentHistory}
          />
          <ClaimRequestDuplicatedSection claimRequest={claimRequest} />
          <ClaimRequestManagementError claimRequest={claimRequest} />
          <ClaimRequestObjectionSection
            claimRequest={claimRequest}
            claimRequestId={claimRequestId}
            refetch={refetch}
          />
        </CardContent>
      </Card>
    </div>

    {/* Right Column (Attachments Viewer) */}
    <div className='w-full px-2 md:w-1/2 lg:w-3/5'>
      <ClaimRequestAttachmentsSection attachments={filteredAttachements} />
    </div>
  </div>

  {/* Previous Requests History Table */}
  {claimRequest.createdBy && (
    <ClaimRequestManagementPrevRequest
      userId={claimRequest.createdBy}
      claimRequestId={claimRequestId}
      claimRequest={claimRequest}
    />
  )}

  {/* Documents Section (Guarded for agent panel: !isAgentPanel) */}
  <ClaimRequestDocumentsSection
    claimRequestId={claimRequestId}
    documents={documents}
  />
</Main>
```

## Discrepancy Prevention Checklist vs Operations Page

1. Header: Agent management has NO `ClaimRequestRegisteredByAgentSection` and NO `ClaimRequestQuickButtons`.
2. Info List: `viewDetailsAdjustmentLink` targets `/agent/claim-requests/$claimRequestId/claim-request-management/` instead of `/claim-requests/...`.
3. Left Column: Uses `ClaimRequestDuplicatedSection` instead of `ClaimRequestReviewSwitcherSection`.
4. Actions: Action buttons (`ClaimRequestManagementActionBtn`) are NOT rendered (commented out in reference).
5. Permissions: `ClaimRequestObjectionSection` and `ClaimRequestDocumentsSection` have built-in `!isAgentPanel` guards preventing agent write actions while preserving view semantics.
