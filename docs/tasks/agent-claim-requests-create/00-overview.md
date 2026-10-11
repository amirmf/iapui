# Agent Claim Requests Create Page Parity

## 1. Scope and Objective

Implement the creation journey page `/agent/claim-requests/create/` in `apps/iap-admin` with exact visual, functional, schema, API, and translation parity to the reference implementation in `insurance-ui` (`src/routes/agent/claim-requests/create.tsx` and `AgentClaimRequestsCreatePage`).

This is a single stand-alone page without sub-routes. It enables registry agents to inquire about an insured user by national code, select their active insurance policy, pick the specific sub-insured person, enter service date and amount, select the document type with guidance alert, upload attachments, and submit the claim request to the backend.

## 2. Reference Mapping

| Reference (`insurance-ui`) | Target (`apps/iap-admin`) | Purpose / Responsibility |
| --- | --- | --- |
| `src/routes/agent/claim-requests/create.tsx` | `apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/create/index.tsx` | Thin route file delegating to `AgentClaimRequestsCreatePage`, with breadcrumb `createClaim` |
| `src/features/agent-claim-requests/pages/agent-claim-requests-create-page.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/agent-claim-requests-create-page.tsx` | Page composition with container, Card, and `AgentClaimRequestForm` |
| `src/features/agent-claim-requests/components/agent-claim-request-form.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-form.tsx` | Main form orchestrating inquiry query, create mutation, alerts, amount, submit date, doc guide, file uploader |
| `src/features/agent-claim-requests/components/agent-claim-request-inquiry-national-code-form-field.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-inquiry-national-code-form-field.tsx` | 10-digit national code inquiry input with `SupportFeatureButton` and selected user display |
| `src/features/agent-claim-requests/components/agent-claim-request-ext-policy-id-form-field.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-ext-policy-id-form-field.tsx` | Searchable policy select with auto-selection of first policy, reset of sub-insured person, and support button |
| `src/features/agent-claim-requests/components/agent-claim-request-ext-national-code-form-field.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-ext-national-code-form-field.tsx` | Sub-insured people query (`getSubInsuredPeople`), foreign/national code labeling, searchable select |
| `src/features/agent-claim-requests/components/agent-claim-request-form-doc-types.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-form-doc-types.tsx` | Doc-type selection via `@modules/doc-types` (`useDocTypesData`), deferred search, "others" priority handling |
| `src/features/agent-claim-requests/components/agent-claim-request-account-not-found-dialog.tsx` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-account-not-found-dialog.tsx` | Confirm dialog on 404 inquiry error, directing to `/agent/users/create/` |
| `src/features/agent-claim-requests/data/agent-claim-request-form-schema.ts` | `apps/iap-admin/src/features/agent-claim-requests/pages/create/model/agent-claim-request-form-schema.ts` | Zod v4 form validation schema with translated error messages |
| `src/features/agent-claim-requests/services/agent-claim-request-service.ts` | `apps/iap-admin/src/features/agent-claim-requests/services/agent-claim-request-service.ts` | API service (already contains `inquiry`, `getSubInsuredPeople`, `create`) |
| `src/locales/fa.json` & `src/locales/en.json` | `apps/iap-admin/src/shared/i18n/locales/{fa,en}/common.json` | Exact translation keys for agent claim requests create and dialogs |

## 3. Architectural Alignment

1. **Page Directory Ownership**:
   - Following `docs/architecture/APPLICATION-ARCHITECTURE.md`, sibling pages in a multi-page feature live under `pages/<page>/`.
   - Creation journey belongs in `pages/create/`.
   - Page-exclusive components live in `pages/create/components/`.
   - Page-exclusive form schema lives in `pages/create/model/`.
2. **Thin Route File**:
   - `src/app/router/routes/_agent/agent/claim-requests/create/index.tsx` stays strictly declarative: imports the page component, exports the route definition, specifies `loader: () => ({ crumb: 'createClaim' })`.
3. **Module & Package Reuse**:
   - `@modules/files`: `FileUploader` for drag-and-drop / file attachments.
   - `@modules/doc-types`: `useDocTypesData` for cached document types.
   - `@iap/support`: `SupportFeatureButton` for field help triggers.
   - `@iap/dialogs`: `ConfirmDialog` with `presentation='reference'`.
   - `@iap/ui`: `SearchableSelect`, `DatePicker`, `Input`, `Alert`, `Button`.
4. **State & Mutation Management**:
   - Form state managed with `react-hook-form` and `zodResolver`.
   - Server queries (`inquiry`, `getSubInsuredPeople`) and mutation (`create`) managed by `@tanstack/react-query`.
   - On success: invalidates `['agentClaimRequests']`, displays toast notification, resets form, navigates to `/agent/claim-requests/`.

## 4. Task Index

- [ ] `01-translations-and-constants.md`: Localization and enum translations parity
- [ ] `02-form-schema-and-contracts.md`: Zod v4 form validation schema
- [ ] `03-account-not-found-dialog.md`: 404 inquiry not found dialog
- [ ] `04-inquiry-and-policy-fields.md`: National code inquiry & policy select fields
- [ ] `05-sub-insured-and-doc-types-fields.md`: Sub-insured person & doc type select fields
- [ ] `06-form-and-page-composition.md`: Form orchestration, create page & thin route
- [ ] `07-verification-and-tests.md`: Unit tests, route tests, typecheck, lint, build
