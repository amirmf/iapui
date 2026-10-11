# Task 07: Verification and Tests

## 1. Objective

Ensure comprehensive test coverage, complete code quality checks, and architectural boundary compliance for the Agent Claim Requests Create page.

## 2. Testing Plan

1. **Schema Validation Tests**:
   - `agent-claim-request-form-schema.test.ts`: test all validation constraints, length checks, edge cases, required fields.
2. **Component Tests**:
   - `agent-claim-request-inquiry-national-code-form-field.test.tsx`
   - `agent-claim-request-ext-policy-id-form-field.test.tsx`
   - `agent-claim-request-ext-national-code-form-field.test.tsx`
   - `agent-claim-request-form-doc-types.test.tsx`
   - `agent-claim-request-account-not-found-dialog.test.tsx`
   - `agent-claim-request-form.test.tsx`
   - `agent-claim-requests-create-page.test.tsx`
3. **Router / Panel Integration Tests**:
   - Verify route `/agent/claim-requests/create/` resolves with breadcrumb `createClaim` and layout guard.

## 3. Verification Commands

Run the following checks from project root / worktree:
```sh
pnpm --filter iap-admin test agent-claim-requests
pnpm --filter iap-admin typecheck
pnpm --filter iap-admin lint
pnpm architecture:check
pnpm --filter iap-admin build
```

## 4. Acceptance Criteria

- All unit and integration tests pass (100%).
- TypeScript compiles with zero errors.
- ESLint and Prettier report zero warnings/errors.
- Architecture boundary rules in `APPLICATION-ARCHITECTURE.md` are satisfied.
- Production build finishes successfully.
