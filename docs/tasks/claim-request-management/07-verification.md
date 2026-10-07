# CRM-07 — Integration verification

Dependencies: all six implementation tasks. Scope is the operations management URL only. Agent/customer-user placeholders and existing external Formio route remain separate journeys.

- [ ] Execute the inspected reference ClaimRequest response schema and compare target acceptance, output stripping/retention, nested contracts and enum maps.
- [ ] Validate all management/assessment HTTP methods, paths, body/query placement, source casing, abort signals, strict invalid outgoing requests and invalid incoming data. Source Tamin mocks remain enabled and issue no HTTP.
- [ ] Verify source locale values from `reference-closure.json`, dynamic enum/tooth/prescription keys and literal source-absent fallbacks.
- [ ] Verify source role/status conditions, pending/disabled actions, form validation and approval guards, mutation failures and awaited/non-awaited success sequencing.
- [ ] Verify shared public capabilities: Badge asChild must produce an actual accessible button; ScrollArea uses source viewport/scrollbar composition. Default consumers remain supported.
- [ ] Verify history filters, 40-row defaults, current-claim exclusion and loaded-ID next navigation. The existing shared main-branch filter reset behavior is retained as an explicit architecture adaptation.
- [x] Run affected tests (15 files / 40 tests), iap-admin typecheck, architecture check, production build and `git diff --check`; scoped lint passes.
- [ ] Review final source diff for public import boundaries, props destructured in body, small component responsibilities, Query-owned server data and conditional classes using public `cn`.

## Evidence categories

Source comparison and automated tests do not prove pixel equality or live backend authorization. Record actual browser/screenshot/live-backend coverage explicitly. Do not mark pending work complete merely because a test suite passed.

## Implementation adaptations already authorized

The user confirmed current architecture request validation with reference fields/API paths. Outgoing request objects are strict; pagination uses the public common factory; Zod v4 nullish/loose/unknown APIs retain equivalent source values. Tamin mock behavior is source-preserved. No invented production integration replaces it. Reusable file/doctor/form/table capabilities are consumed through public APIs. Commented source controls remain unmounted.
