# Task 03: My Claims Detail Page (`/myclaims/$id/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-detail-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/myclaims/$id.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/myclaims/$id.index.tsx`
- **Target Page**: `apps/iap-app/src/features/claim-requests/pages/detail/my-claim-request-detail-page.tsx`

## Component Breakdown

1. **`MyClaimRequestDetailPage`** (`pages/detail/my-claim-request-detail-page.tsx`):
   - Extracts `id` parameter via TanStack Router `useParams`.
   - Fetches claim data using `useGetMyClaimRequestById` (`GET /my/iap/claim-requests/${id}`).
   - Handles loading, error (`Alert variant='destructive'`), and content states.
   - Provides bottom navigation back button to `/myclaims/`.
2. **`MyClaimRequestPageHeader`** (`components/my-claim-request-page-header.tsx`):
   - Title: `claimRequests.actions.viewDetails`.
   - `showBackButton` enabled.
3. **`MyClaimRequestDetailInfoList`** (`pages/detail/components/my-claim-request-detail-info-list.tsx`):
   - Detailed breakdown grid:
     - Tracking code, submit date, patient details, disease type, insurance policy.
     - Requested amount, approved amount, deduction/franchise.
4. **`MyClaimRequestDetailActions`** (`pages/detail/components/my-claim-request-detail-actions.tsx`):
   - Conditional actions based on claim state:
     - Objection trigger button (opens `MyClaimRequestObjectionForm`).
     - Delete action (`MyClaimRequestDetailDeleteAction`) for draft claims.
5. **`MyClaimRequestDetailIResult`** (`pages/detail/components/my-claim-request-detailI-result.tsx`):
   - Displays evaluation results, adjudicator notes, deduction reasons, and payment status.
6. **`MyClaimRequestObjectionForm`** (`pages/detail/components/my-claim-request-objection-form.tsx`):
   - Dialog/form to submit objections:
     - Description text area.
     - Supporting document attachments.
     - Submits via `myClaimRequestService.submitObjection`.
7. **`FileViewer`** (`@iap/ui` or feature component):
   - Gallery/viewer for uploaded claim attachments.

## API & Schema Contract

- **Detail Query**:
  - `GET /my/iap/claim-requests/${id}`
  - Response Schema: `claimRequestSchema`
- **Objection Submission**:
  - `POST /my/iap/claim-requests/objections`
  - Body: `{ claimRequestId, description, attachments, claimRequestStatus }`
  - Response Schema: `claimRequestSchema`

## Translation Keys

- `claimRequests.actions.viewDetails`
- `myiap.claimRequests.details.*`
- `myiap.claimRequests.objection.*`
- `common.back`
- `common.loading`
- `errors.general.heading`
- `errors.general.description`
