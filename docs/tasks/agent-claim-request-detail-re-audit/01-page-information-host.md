# 01 — Page, information and inherited host audit

Source root: insurance-ui/src. Target: apps/iap-admin/src unless a package is named.

## Verified discrepancy tasks (before implementation)

- [x] H1: Source AgentLayout content uses px-2 at desktop and puts page directly after its header with gap-6. Target shell uses sm:p-4 and a padded max-w-1600 main. Scope source horizontal padding and unbounded host with pt-6/pb-0 to the exact /agent/claim-requests/{id}/ detail route; preserve unrelated pages and panel ownership.
- [x] H2: Source FontProvider sets a root font-* class, whose _base.scss sets --font-app to 'Vazir', sans-serif. Its public/fonts/fa/fontFa.css registers Vazirmatn, not Vazir. Target uses registered Vazirmatn and antialiasing/font-synthesis settings; these change text width and card geometry. Reproduce actual source font fallback and rendering options on the scoped page. Do not silently fix source's font name.
- [x] H3: Source _base.scss gives every element border-border/outline-ring. Target document base does not, so card/result/readonly border defaults can differ despite identical utility strings. Add source-equivalent scoped defaults for bare borders and outlines on this page; explicit status/control colors must still override.
- [x] H4: Source mobile inputs/selects/textarea use 14px !important; target document uses 16px. Scope source mobile typography and removal of target autofill override to this page.

## Inspected components with no behavioral discrepancy

AgentClaimRequestsDetailPage: identical error/loading/empty/retained-data branches, class tokens, order and attachment gating; error extractor uses existing reference presentation. Alert/AlertTitle/AlertDescription match source DOM/classes. AgentClaimRequestDetailInfoList: identical field order, conditionals, amount/whitespace/array fallbacks, source labels, docType fallback and date patterns. MyClaimRequestReadonlyItems matches string p versus direct node rendering and exact classes. Badge outline/reference matches span markup and relevant source tokens. useGetAgentClaimRequestById matches key, ID guard, cancellation, stale/gc 5000; architectural path prefix only. Route loader crumb claimDetails matches, route stays thin.

Dates: @iap/ui options language=i18n.language, normalizeTimezone=false, invalidDate=throw reproduce source Tehran conversion and exact fa check. Extra memo dependency on language is a deliberate correctness adaptation without changing formatted output. Add independent source-derived expected Persian date fixtures rather than asserting the formatter against itself.

Component names remain AgentClaimRequestsDetailPage, AgentClaimRequestDetailInfoList, AgentClaimRequestDetailResult, AgentClaimRequestObjectionForm and MyClaimRequestReadonlyItems. Paths differ by accepted architecture. Result sorting copies before sort to preserve server cache; visible order matches source.

Acceptance: scoped host/default-host regressions; CSS boundary evidence; independent fa/en date and page branch tests; typecheck/lint/architecture/build. Browser/backend evidence must be reported separately.

## Completion evidence

H1–H4 implemented with page-scoped CSS and a detail-route-only host presentation. Seven host tests preserve creation/list/management and signup behavior. Six information tests include literal source date outputs (fa 1405/07/19 and en Oct 11, 2026), rather than only formatter self-comparisons. Five page/query branch tests remain passing. Bare border defaults exclude explicit border-* classes so status and form control colors remain authoritative; the source FontProvider fallback is preserved. Application compilation, lint and architecture checks are recorded in the audit README.
