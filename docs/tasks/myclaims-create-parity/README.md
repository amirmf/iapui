# My Claims Create Page Parity

## Scope
Implement `/_authenticated/myclaims/create/` in `iap-app` with verified parity to the reference route `/_app/myiap/myclaims/create` in `insurance-ui`.

## Verified reference entry
- Route: `src/routes/_app/myiap/myclaims/create.tsx`
- Page: `src/features/my-iap/claim-requests/pages/my-claim-request-create-page.tsx`
- Form: `src/features/my-iap/claim-requests/components/my-claim-request-form.tsx`

## Architecture mapping
- Route remains a thin TanStack Router entry under `apps/iap-app/src/app/router/routes/_authenticated/myclaims/create/`.
- Page and page-exclusive form code belong to `apps/iap-app/src/features/my-claims/pages/create/` (or the existing feature boundary where shared contracts already live).
- Reusable insurance-policy and sub-insured-person field capabilities remain in the existing feature/modules public APIs.
- Backend contract schemas are Zod v4 and API calls remain in feature services.
- All conditional classes use `cn` from `@iap/ui`.

## Exact reference behavior
The page renders a max-width, padded container, `MyClaimRequestPageHeader` with `myiap.claimRequests.form.title` and `.description`, then a Card containing `MyClaimRequestForm`; success navigates to `/myiap/myclaims`. The form fields are policy, sub-insured person, submit date, amount in rial, document type, conditional document guide, required attachments, and submit action. It uses the reference service endpoints and translation keys documented in the task files.
