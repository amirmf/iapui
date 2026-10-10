# Task 06: Special Diseases Detail Page (`/special-diseases/$id/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/special-diseases/pages/my-special-disease-detail-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/special-diseases/$id.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/special-diseases/$id.index.tsx`
- **Target Page**: `apps/iap-app/src/features/special-diseases/pages/detail/my-special-disease-detail-page.tsx`

## Component Breakdown

1. **`MySpecialDiseaseDetailPage`** (`pages/detail/my-special-disease-detail-page.tsx`):
   - Extracts `id` via `useParams`.
   - TanStack Query hook: `useMySpecialDiseaseDetail({ id })` (`GET /my/special-diseases/${id}`).
   - Handles loading, error, and detail layout sections.
   - Provides back button linking to `/special-diseases/`.
2. **`MySpecialDiseaseHeader`** (`pages/detail/components/my-special-disease-header.tsx`):
   - Shows disease title, registration code, submit date, and current status badge.
3. **`MySpecialDiseaseInfo`** (`pages/detail/components/my-special-disease-info.tsx`):
   - Read-only data presentation:
     - Patient national code, full name, phone.
     - Disease category, ICD code (if available), medical center, attending physician.
   - Composes `MySpecialDiseaseReadonlyItem` for structured label-value pairs.
4. **`MySpecialDiseaseLatestResponse`** (`pages/detail/components/my-special-disease-latest-response.tsx`):
   - Medical committee adjudication results: approved status, ceiling amount, evaluator comments.
5. **`MySpecialDiseaseHistory`** (`pages/detail/components/my-special-disease-history.tsx`):
   - Status progression and chronological review log.
6. **`MySpecialDiseaseAttachments`** (`pages/detail/components/my-special-disease-attachments.tsx`):
   - List of uploaded medical evidence with thumbnail and download links.
7. **`MySpecialDiseaseObjectionForm`** (`pages/detail/components/my-special-disease-objection-form.tsx`):
   - Enables customer to submit an objection to rejected decisions:
     - Objection text and reason.
     - Supplemental attachment uploads.
     - Calls `mySpecialDiseaseService.addObjection`.

## API & Schema Contract

- **Detail Query**:
  - `GET /my/special-diseases/${id}`
  - Response Schema: `mySpecialDiseaseSchema`
- **Objection Submission**:
  - `POST /my/special-diseases/${id}/objections`
  - Body: `{ description, attachments }`
  - Response Schema: `mySpecialDiseaseSchema`

## Translation Keys

- `myiap.specialDiseases.details`
- `myiap.specialDiseases.details.*`
- `myiap.specialDiseases.objection.*`
- `common.back`
- `common.loading`
