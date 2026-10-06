# TASK-11: Testing and Quality Assurance Validation

## Objective
Add automated tests and run all mandatory quality gates to verify complete parity, zero regression, and architecture compliance.

## Test Suites to Implement

1. **Contract & Schema Tests:**
   - `packages/api-types/src/assignement-rule/index.test.ts`: validates schema parsing of valid entities, optional/nullish fields, and rejects invalid structures.

2. **Service Tests:**
   - `apps/iap-admin/src/features/assignement-rules/services/assignement-rule-service.test.ts`: validates all endpoint URLs, HTTP verbs, ISO date conversions, filter parameter passing, and bulk delete body.

3. **Store Tests:**
   - `apps/iap-admin/src/features/assignement-rules/context/store/assignement-rule-store.test.ts`: validates dialog opening, closing, row setting, and reset.
   - `apps/iap-admin/src/features/assignement-rules/model/assignement-rule-row-selection.test.ts`: validates ID extraction logic.

4. **Table State & Route Adapter Tests:**
   - `apps/iap-admin/src/features/assignement-rules/route-adapters/table-search.test.ts`: validates pagination & filter URL parsing and serialization.

5. **Component Tests:**
   - `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-columns.test.tsx`
   - `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-form-dialog.test.tsx`
   - `apps/iap-admin/src/features/assignement-rules/assignement-rules-page.test.tsx`

## Quality Gates to Execute

Run and verify each of the following local gates:
```bash
# 1. Unit & Component Tests
pnpm --filter iap-admin test

# 2. Type Checking
pnpm check-type

# 3. Linter & Architecture Boundaries
pnpm lint

# 4. Production Build
pnpm build

# 5. Git Diff Cleanliness
git diff --check
```

## Acceptance Criteria
- [ ] All new tests pass with no flaky assertions.
- [ ] No regression in existing tests across the monorepo.
- [ ] Architecture boundary check (`tools/check-architecture.mjs`) passes with 0 violations.
- [ ] Zero TypeScript or lint errors.
