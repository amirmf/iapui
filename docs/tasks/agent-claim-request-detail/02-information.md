# 02 — Detail information

Source: features/agent-claim-requests/components/agent-claim-request-detail-info-list.tsx and features/my-iap/claim-requests/components/my-claim-request-readonly-items.tsx.

Port AgentClaimRequestDetailInfoList, preserving component name and field order: beneficiary, amount, status, main person (subInsuredPerson label), mobile, submit date, optional createdAt, policy, optional document type, business key. Preserve whitespace/array fallback, English numeric grouping, PP/PPpp date formatting, conditional relation, status Badge and three-column responsive grid. Readonly string values use p; React node values render directly. Keep focused components in pages/detail/components, use cn from @iap/ui. Do not import customer application features.

Acceptance: zero/missing fields, optional rows, docType/document fallback, dates and status tested. Independent of result/form. Status: implemented; verification recorded below.

Verified evidence: four information tests cover field order, zero and whitespace fallbacks, arrays, status keys/colors, conditional relation/date/document rows, English amount grouping and readonly node/string rendering. Date formatting forwards host language, disables timezone normalization and preserves source invalid-date throwing. Badge opts into reference presentation.
