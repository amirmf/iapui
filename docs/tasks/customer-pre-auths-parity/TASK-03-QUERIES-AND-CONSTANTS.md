# Task 03: Pre-Auth Service, Queries, and Status Constants

## Objective
Implement `preAuthService`, `usePreAuths` TanStack Query hook, and `pre-auth-status-constant.ts` in `apps/iap-app/src/features/pre-auths/`.

## Reference Implementation
- `insurance-ui/src/features/my-iap/pre-auths/services/pre-auth-service.ts`
- `insurance-ui/src/features/my-iap/pre-auths/hooks/use-pre-auths.ts`
- `insurance-ui/src/constants/pre-auth-status-constant.ts`

## Files to Create in `apps/iap-app/src/features/pre-auths/`:
1. `constants/pre-auth-status-constant.ts`:
   - `PreAuthStatus`: `101 | 102 | 103`
   - `preAuthStatusColors`: Record mapping status to background, text, and border CSS classes
   - `preAuthStatusBorderColors`: Record mapping status to card border classes
   - `PRE_AUTH_STATUS_TRANSLATION_KEYS`: `101: 'myiap.preAuths.status.draft'`, `102: 'myiap.preAuths.status.approved'`, `103: 'myiap.preAuths.status.cancelled'`
   - `getPreAuthStatusOptions(t)`: Helper returning `{ label, value }` array
2. `services/pre-auth-service.ts`:
   - `getPage(request: GetPreAuthsRequest, signal?: AbortSignal): Promise<PagePreAuth>`
   - Endpoint: `GET /my/iap/pre-auths/page-full`
   - Request params validated by `getPreAuthsRequestSchema.parse(request)`
   - Response validated by `pagePreAuthSchema.parse(response.data)`
3. `queries/use-pre-auths.ts`:
   - `preAuthQueryKeys`: `['my-iap-pre-auths', 'list', request]`
   - `usePreAuths(request: GetPreAuthsRequest | null)`
   - `enabled: request !== null`
   - `placeholderData: (previousData) => previousData`
   - `staleTime: 30_000`, `gcTime: 30_000`

## Acceptance Criteria
- Exact key parity with reference.
- Status constant matches reference line-by-line.
- Query hook handles disabled state when filters are null.
