# Assessment, review, history, files parity audit

Reference: `insurance-ui/src/features/claim-requests/pages/claim-request-management-page.tsx` and all imports under `src/features/claim-requests/components/`.
Target: `iap-admin/src/features/claim-requests/pages/claim-request-management/`.

## Component-by-component result

| Reference component | Target component | Result | Verified details |
| --- | --- | --- | --- |
| `claim-request-assessment-items-section.tsx` | same name | Equivalent adapter | Target re-exports the assessment-items feature, preserving provider/content behavior through the current feature public API. |
| `claim-request-ai-assessment-results-section.tsx` | same name + `claim-request-ai-assessment-result-card.tsx` | Equivalent extraction | Result keys, empty state, separator, enum translation maps, card colors, badge colors, amount/quantity formatting and mounted order match reference. |
| `claim-request-attachments-section.tsx` | same name | Equivalent adapter | Same empty guard, card height, padding and file viewer wrapper; target uses `@modules/files` public API. |
| `claim-request-doctor-responses.tsx` | same name | Equivalent | Same `DOCTOR_USER` filter, description trim guard, doctor fallback, translated title/response/date and separator. |
| `claim-request-documents-section.tsx` | same name | Equivalent adapter | Same admin-only and non-agent permission gate, card/header/content structure and documents child. |
| `claim-request-documents.tsx` | same name | Equivalent | Same document key fallback, active tab reconciliation, iframe URL, title/unavailable/empty translations and 85vh viewer. Removed reference-only comments only. |
| `claim-request-assign-section.tsx` | same name | Equivalent adapter | Same assignment UI and assignment-history rendering; service/schema calls use target public contracts. |
| `claim-request-assignment-history.tsx` | same name | Equivalent | Same five columns, accessors, date/long-text cells, 40-row initial pagination, sorting and max-height table. `presentation="reference"` preserves reference table visuals. |
| `claim-request-objection-form.tsx` | same name + status fields/guards | Equivalent extraction | Same schema fields/defaults, duplicate and over-payment guards, return-template flow, submit payload (`claimRequestId`, description fallback, status, cheat), translations and mutation invalidation. |
| `claim-request-objection-section.tsx` | same name + objection chat | Equivalent | Same result reasons, objection chat and role/status permission behavior; target role helpers are the architecture-approved equivalent. |
| `claim-request-review-switcher-section.tsx` | same name | Equivalent | Same duplicate/AI availability, initial active section, translated labels/icons, direction and active button styling. |
| `claim-request-last-status-section.tsx` | same name | Equivalent adapter | Same status selection, translation/color maps, payment date and history dialog. |
| `claim-request-registered-by-agent-section.tsx` | same name | Equivalent | Same conditional registration-agent display and translation. |
| `claim-request-management-error.tsx` | same name | Equivalent | Same error status and translated message behavior. |
| `claim-request-management-pending.tsx` | same name | Equivalent | Same skeleton layout and dimensions. |
| `claim-request-management-query-error.tsx` | same name | Equivalent | Same query error message and retry action. |
| `duplicated/claim-request-duplicated-section.tsx` and image dialog | same names | Equivalent | Same duplicate grouping, enum translations/colors, image dialog and duplicate review action. |
| `claim-request-management-prev-request/*` | same names | Equivalent | Same history endpoint contract, filter fields, table columns, row actions and pagination. |

## API/schema/translation checks

- Management query uses the exact reference query key (`['claimRequest', claimRequestId]`), 10-second stale/cache lifetimes, focus refetch and abort signal forwarding.
- Target management service preserves reference endpoint paths for patch, policy details, assignment, objection, doc type and history operations, with strict target schemas at each boundary.
- All mounted enum maps and translation keys are sourced from target constants/locales whose parity is covered by `reference-parity.test.ts`.
- The target architecture changes import paths and UI primitive APIs only; no reference endpoint, payload field, schema field, component name or translation key was invented.

## Follow-up resolved

The page audit resolved the route type boundary while preserving the reference runtime literal for `viewDetailsAdjustmentLink`. No remaining discrepancy is recorded for this closure.
