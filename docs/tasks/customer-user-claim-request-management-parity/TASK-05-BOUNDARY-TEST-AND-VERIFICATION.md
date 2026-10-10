# Task 05 — Boundary Test and Verification

## Objective
Port `customer-user-import-boundary.test.ts` from reference and run full verification gates across `iap-admin`.

## Reference Test
File: `insurance-ui/src/features/customer-user/customer-user-import-boundary.test.ts`
- Tests zero cross-imports between `customer-user` and `agent-claim-requests`.

## Verification Gates
1. `pnpm --filter iap-admin test src/features/customer-user`
2. `pnpm --filter iap-admin typecheck`
3. `pnpm --filter iap-admin lint`
4. `pnpm architecture:check`
5. `pnpm --filter iap-admin build`
