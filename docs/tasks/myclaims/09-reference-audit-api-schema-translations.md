# Task 09 — API, schema, and translation audit

This audit compares the mounted reference closure under `insurance-ui/src/features/my-iap/claim-requests` with `iap-app/src/features/my-claims` and shared public packages.

## Verified discrepancies

1. The reference service exposes `getPage`, `getById`, `create`, `submitObjection`, `getMyBankAccount`, `addMyBankAccount`, `editMyBankAccount`, and `delete`. The target service currently exposes only `getPage` and `delete`; page scope currently mounts only the latter two, but the public service name and full source API surface must be retained when the feature boundary is treated as the reference contract.
2. The reference imports feature-local schemas (`my-claim-request-schema`, bank account, objection, insurance policy, sub-insured person). Target reuses canonical public `@iap/api-types` response schemas and adds only a list request schema. This is an intentional architecture adaptation only where the public contract is equivalent; every mounted response item and lookup response is validated at the API boundary.
3. The reference sends page query filters directly through Axios `params`; target uses mandatory `transformApiFilterParams`, which serializes arrays using the accepted workspace `__in` transport contract. This is an architecture-required transport adaptation and is covered by service tests.
4. Reference service defaults `size=10`; page passes `size=9`. Target preserves both defaults.
5. Source locale values must be copied only for mounted keys. `reference-translations.fixture.json` records 83 exact Persian values and the test compares them against target resources. Source-absent fallbacks remain explicit.
6. Reference paths use `/myiap/...`; customer app canonical paths use `/myclaims/...` per `customer-portal-app` contract. API paths remain `/my/iap/...`.

## Acceptance

No API/schema/translation behavior may be invented. The service tests cover request defaults, endpoint, filter serialization, abort signal, invalid nested responses, delete path, and exact locale fixture equality.

Status: complete.
