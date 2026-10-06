> Historical: completion claims superseded by `outpatient-doc-acceptances-reconciliation.md`.

# OutpatientDocAcceptances contract parity audit

## Status

Rechecked on 2026-10-06: API contracts and the mutation/detail service closure
are implemented. Endpoint-focused tests pass; live-backend verification is out
of scope.

Compared reference `insurance-ui/src/features/outpatient-doc-acceptances` with target `iap-ui/apps/iap-admin` on 2026-10-06. This is an evidence-backed discrepancy list; paths and names below are taken directly from the reference source.

## Service/API discrepancies

Target `apps/iap-admin/src/features/claim-reports/services/outpatient-doc-acceptance-service.ts` currently exposes only:

- `getPage` -> `GET /outpatient-doc-acceptances/page`
- `exportReport` -> `GET /outpatient-doc-acceptances/export-report`
- `exportPdfReport` -> `GET /outpatient-doc-acceptances/export-report/pdf`

Reference `insurance-ui/src/features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service.ts` additionally exposes the following methods and contracts, all required by the page closure:

1. `getById(id, {signal?})` -> `GET /outpatient-doc-acceptances/{id}`; parse `outpatientDocAcceptanceSchema`.
2. `create(form)` -> `POST /outpatient-doc-acceptances`; parse `outpatientDocAcceptanceFormSchema`, map and parse response.
3. `update(id, form)` -> `PATCH /outpatient-doc-acceptances/{id}` with `{id,...mappedForm}`.
4. `generate(form)` -> `POST /outpatient-doc-acceptances/generate` with ISO `date` and `claimRequestId`; returns parsed array.
5. `generateAdjustment(form)` -> `POST /outpatient-doc-acceptances/adjustment/generate`; returns parsed array.
6. `send(form)` -> `POST /outpatient-doc-acceptances/send` with `outpatientDocAcceptanceId`; returns parsed array.
7. `delete(id)` -> `DELETE /outpatient-doc-acceptances/{id}`.
8. `getClaim(docAcceptanceId)` -> `GET /outpatient-claims/{docAcceptanceId}`, 404 maps to `null`.
9. `createClaim(docAcceptanceId, form)` -> `POST /outpatient-claims/{docAcceptanceId}`.
10. `updateClaim(docAcceptanceId, form)` -> `PUT /outpatient-claims/{docAcceptanceId}`.
11. `deleteClaim(docAcceptanceId)` -> `DELETE /outpatient-claims/{docAcceptanceId}`.
12. `syncInqueryStatuses()` -> `POST /outpatient-claims/sync-inquery-statuses`, returns numeric response.
13. `getIssuance(docAcceptanceId)` -> `GET /issuances/{docAcceptanceId}`, 404 maps to `null`.
14. `createIssuance(docAcceptanceId, form)` -> `POST /issuances/{docAcceptanceId}`.
15. `updateIssuance(docAcceptanceId, form)` -> `PUT /issuances/{docAcceptanceId}`.
16. `deleteIssuance(docAcceptanceId)` -> `DELETE /issuances/{docAcceptanceId}`.
17. `getDmgCases(docAcceptanceId)` -> `GET /dmg-cases/{docAcceptanceId}`, parsed array.
18. `getDmgCaseById(docAcceptanceId, dmgCaseId)` -> `GET /dmg-cases/{docAcceptanceId}/{dmgCaseId}`.
19. `createDmgCase(docAcceptanceId, form)` -> `POST /dmg-cases/{docAcceptanceId}`.
20. `updateDmgCase(docAcceptanceId, dmgCaseId, form)` -> `PUT /dmg-cases/{docAcceptanceId}/{dmgCaseId}`.
21. `deleteDmgCase(docAcceptanceId, dmgCaseId)` -> `DELETE /dmg-cases/{docAcceptanceId}/{dmgCaseId}`.
22. `cancel(id)` -> `POST /outpatient-doc-acceptances/cancel`, body `{ outpatientDocAcceptanceId: id }`.
23. `terminate(id)` -> `POST /outpatient-doc-acceptances/terminate`, same body.
24. `softDelete(ids, thruDate?)` -> `PUT /outpatient-doc-acceptances/soft-delete`, raw `ids` body and optional `thruDate` query; returns parsed array.
25. `bulkDelete(ids)` -> `DELETE /outpatient-doc-acceptances/bulk-delete`, raw ids in request `data`.

`getPage` parity gap: reference accepts `page`, `size`, `sort`, `direction`, `filters`, and sends all of them. Target service request type only carries the shared page request and sends `page`, `size`, and transformed filters; explicit `sort`/`direction` support must match reference route state and default ordering.

## Schema/type discrepancies

Reference schema source: `insurance-ui/src/features/outpatient-doc-acceptances/data/outpatient-doc-acceptance-schema.ts`. Target API types are in `iap-ui/packages/api-types/src/outpatient-doc-acceptance/index.ts`.

- Reference defines the complete form and nested operation schemas in this module: `outpatientDocAcceptanceFormSchema`, `outpatientDocAcceptanceGenerationFormSchema`, `outpatientDocAcceptanceAdjustmentGenerationFormSchema`, `outpatientDocAcceptanceSubmissionFormSchema`, `outpatientClaimFormSchema`, `issuanceFormSchema`, and `dmgCaseFormSchema`. Target package exports only read/page/export contracts; these mutation form schemas/types are absent.
- Reference `DmgCase` includes all fields used by `mapDmgCaseForm` (insured/service/financial/calculation fields plus `status`, `claimRequestId`, `assessmentItemId`, `wsResult`, `wsStatus`). Verify target `DmgCase` is expanded identically before implementing damage-case dialogs.
- Reference `Issuance` includes `dmgCases` and recursive `afterInqueryResult`; target read type must preserve both nested fields.
- Reference `OutpatientClaim` includes `inqueryStatusId`, `inqueryStatusTitle`, and nested `issuance`; these are required by view/claim dialogs.
- Reference `OutpatientDocAcceptance` includes `extLocationId`, `inqueryStatusId`, `inqueryStatusTitle`, `cancelWsResponseStatus`, `cancelWsResponseBodyText`, `outpatientClaim`, `createdAt`, and `updatedAt`; all must remain nullable/optional with the same names and types.
- Reference page schema parses the complete Spring page envelope (`totalPages`, `totalElements`, `pageable`, `size`, `content`, `number`, `sort`, `numberOfElements`, `first`, `last`, `empty`). Target `createPageResponseSchema` is acceptable only if its inferred shape includes these same keys.
- Reference status enums are exact: `SUBMIT | SENT_TO_SERVER | REJECT | FAILED | DELETED | SUCCESS`; WS enum exact spelling is `FAILD | PROGRESS | DONE` (the `FAILD` typo is part of the API contract).

## Constants and translation parity

Reference constants: `insurance-ui/src/constants/outpatient-doc-acceptance-status-constant.ts`. Target duplicate currently lives under `features/claim-reports/constants` and `features/outpatient-doc-acceptances/constants`; canonical target placement should follow the existing architecture, but values and keys must remain exact.

Required exact maps:

- `outpatientDocAcceptanceStatusColors` for all six statuses.
- `outpatientDocAcceptanceWsStatusColors` for `FAILD`, `PROGRESS`, `DONE`.
- `OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS` -> `outpatientDocAcceptances.status.{STATUS}`.
- `OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS` -> `outpatientDocAcceptances.wsStatus.{WS_STATUS}`.
- `getOutpatientDocAcceptanceStatusOptions(t)` and `getOutpatientDocAcceptanceWsStatusOptions(t)` must iterate those maps and return `{label,value}` in reference order.

Target Persian locale already contains the status namespaces, but every component must use the exact reference keys under `outpatientDocAcceptances.*`; do not introduce renamed keys or English fallbacks. Form/dialog work must copy the reference translation keys from the corresponding component files.

## Implementation task breakdown

- **Contract task A:** port missing schemas/types and export them through `@iap/api-types` public API.
- **Contract task B:** implement all 25 missing service methods with reference endpoint, HTTP verb, body/query shape, 404 behavior, and schema parsing.
- **Contract task C:** reconcile page request sorting (`sort`, `direction`) and filter transformation with reference.
- **Contract task D:** consolidate/use exact status constants and translation maps; verify locale key parity.
- **Contract task E:** add contract tests covering every endpoint and schema parse, using reference tests as the source of expected payloads.

## Verification update (2026-10-06)

Focused tests now cover the implemented route request boundary and enum
presentation constants. Endpoint and mutation schema coverage remains open
until the missing reference service methods and form schemas are ported.
