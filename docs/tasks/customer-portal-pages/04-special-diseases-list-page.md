# Task 04: Special Diseases List Page (`/special-diseases/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/special-diseases/pages/my-special-diseases-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/special-diseases/index.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/special-diseases/index.tsx`
- **Target Page**: `apps/iap-app/src/features/special-diseases/pages/index/my-special-diseases-page.tsx`

## Component Breakdown

1. **`MySpecialDiseasesPage`** (`pages/index/my-special-diseases-page.tsx`):
   - Synchronizes URL search state using TanStack Router `useSearch` and `useNavigate`:
     - `page`, `status`, `nationalCode`, `diseaseName`.
   - TanStack Query hook: `useMySpecialDiseases({ page, size: 9, filters })`.
   - Renders paginated grid of records or empty state.
2. **`MySpecialDiseasePageHeader`** (`components/my-special-disease-page-header.tsx`):
   - Title: `myiap.specialDiseases.title`.
   - Description: `myiap.specialDiseases.description`.
   - Actions:
     - Refresh button calling `query.refetch()`.
     - Create button (`Button asChild`) linking to `/special-diseases/create/`.
3. **`MySpecialDiseaseFilter`** (`pages/index/components/my-special-disease-filter.tsx`):
   - Filter inputs for status dropdown, national code, and disease name.
   - Pushes updated search params to URL.
4. **`MySpecialDiseaseCard`** (`pages/index/components/my-special-disease-card.tsx`):
   - Card displaying:
     - Disease title and category.
     - Insured/patient national code and name.
     - Submission and registration dates.
     - `MySpecialDiseaseStatusBadge` with status mapping.
     - Link to view record details (`/special-diseases/$id/`).
5. **`MySpecialDiseaseQueryState`** (`components/my-special-disease-query-state.tsx`):
   - `MySpecialDiseaseLoading`: Centered loading state.
   - `MySpecialDiseaseQueryError`: Destructive alert with retry trigger.
6. **`Pagination`**:
   - Double pagination (top and bottom) synchronizing `page` param with Router.

## API & Schema Contract

- **Endpoint**: `GET /my/special-diseases`
- **Request Parameters**:
  - `page`: number (0-indexed)
  - `size`: number (default 9)
  - `status`?: string
  - `extNationalCode`?: string
  - `diseaseName`?: string
- **Response Schema**:
  - `mySpecialDiseasePageSchema` validating page metadata and array of `mySpecialDiseaseSchema` items.

## Translation Keys

- `myiap.specialDiseases.title`
- `myiap.specialDiseases.description`
- `myiap.specialDiseases.create`
- `myiap.specialDiseases.empty`
- `myiap.claimRequests.refresh`
- `myiap.claimRequests.noResults`
- `common.loading`
