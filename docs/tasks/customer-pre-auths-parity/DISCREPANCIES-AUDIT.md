# Customer Pre-Authorizations Discrepancies Audit

## 1. Route & Layout URL
- **Reference**: `insurance-ui/src/routes/_app/myiap/pre-auths/index.tsx` -> URL `/myiap/pre-auths/`
- **Target**: `apps/iap-app/src/app/router/routes/_authenticated/pre-auths/index.tsx` -> URL `/pre-auths/` (canonicalized trailing slash, guarded by `beforeLoadPublicApp` in `_authenticated/route.tsx`)
- **Status**: Target exists as `PlaceholderPage` stub; needs replacing with `PreAuthsPage`.

## 2. API Endpoints & Contracts
| Operation | Reference Endpoint | Target Endpoint | OpenAPI Spec |
| --- | --- | --- | --- |
| Pre-authorizations list | `GET /my/iap/pre-auths/page-full` | `GET /my/iap/pre-auths/page-full` | `findMyPreAuths` (`PagePreAuthInquiryDto`) |
| Sub-insured people | `GET /my/iap/sub-insured-people/{policyId}` | `GET /my/iap/sub-insured-people/{policyId}` | `getSubInsuredPeople` (`SubInsuredPersonResponse[]`) |
| Insurance policies | `GET /my/iap/my-policies` | `GET /my/iap/my-policies` | Exists in `apps/iap-app/src/features/home/services/` |

## 3. Schema & Validation Standards
- **Reference**: Uses manual zod schemas with loose nullable/optional chaining in `features/my-iap/pre-auths/data/pre-auth-schema.ts`.
- **Target**: Uses workspace contract package `packages/api-types/src/pre-auths/index.ts` with:
  - Zod v4 `z.object().loose()` for responses
  - `createPageResponseSchema` from `@iap/api-types/src/common`
  - `.nullish()` for fields accepting null or undefined
  - Strict input request schemas (`getPreAuthsRequestSchema`, `getSubInsuredPeopleRequestSchema`)

## 4. Components & Architecture
- **Reference**: Directly imports from `@/components/ui/*`, `@/components/select/searchable-select`, `@/components/dialogs/confirm-dialog`.
- **Target**:
  - Primitives: `@iap/ui` (`Button`, `Card`, `CardContent`, `Badge`, `Alert`, `AlertTitle`, `AlertDescription`, `SearchableSelect`, `cn`).
  - Dialog: `@iap/dialogs` (`ConfirmDialog`).
  - Form: `react-hook-form` + `@iap/forms` or `@iap/ui`.
  - Localization: `useTranslation()` from `react-i18next`.
  - Iconography: `RotateCwIcon` from `lucide-react` or `IconRefresh` from `@tabler/icons-react`.
  - Formatting: `formatAmount` using `Intl.NumberFormat`.

## 5. Enum & Constants Alignment
- **File**: `pre-auth-status-constant.ts`
- Status codes:
  - `101`: `myiap.preAuths.status.draft` (bg-yellow-100/30, text-yellow-900, border-yellow-400)
  - `102`: `myiap.preAuths.status.approved` (bg-green-100/30, text-green-900, border-green-400)
  - `103`: `myiap.preAuths.status.cancelled` (bg-red-100/30, text-red-900, border-red-400)
- Identical to `insurance-ui/src/constants/pre-auth-status-constant.ts` and `apps/iap-admin/src/features/assessment-items/constants/pre-auth-status-constant.ts`.
