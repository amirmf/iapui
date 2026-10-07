# Final complete Support source audit

Date: 2026-10-07. This is the current integrated audit after the user's latest
nullish-content, admin page ownership and customer claim URL decisions.
Earlier implementation and re-audit reports are historical evidence.

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/support`.
Target: `/home/sadegh/.codex/worktrees/support-reference-parity/iap-ui`, branch
`codex/support-reference-parity`; shared `packages/support`, public contracts,
primitives and admin host composition. No commit or merge was performed.

## Complete coverage

| Area | Actual evidence and result |
| --- | --- |
| Direct source closure | All 36 implementation files, all 24 TSX files and all 35 declared public/private React function names were compared against actual source. No omitted or renamed source component found. |
| Root flow and host | Store, raw context, option mappings, element-size hook and SVG icon have identical transpiled runtime token streams after import removal. Provider, widget and every public button were inspected with their mounted dependencies; admin layouts and three public password-auth pages were compared. |
| Window | All 16 implementation files and reached Markdown/status/format helpers inspected. All 56 literal class token sets across 12 TSX files match; conditional classes, attributes, effects, callbacks and branches reviewed separately. |
| Tickets | All five component files, both hooks, private components, account-scoped query keys, ownership guards, cancellation, loading/error/empty/refresh/pagination/scroll branches, dates/status colors and mounted primitives inspected. |
| API | All five service methods retain source names, HTTP methods, paths, body/query placement, filter precedence, credentials, AbortSignal forwarding and request/response parsing. No API mismatch found. |
| Schema | All 29 source-exported flow/My-IAP/ticket schemas and nested users/messages/histories/enums/page metadata compared for acceptance, parsed output and full ordered issues. The approved content-nullish exception is explicitly applied before nested source schemas are composed. No other acceptance mismatch found. |
| Localization | Source supportFlow subtree, every literal translation call in the source closure and dynamic option/claim/ticket mappings inspected. Both app Persian locale values and source component function names pass actual-source tests. No translation or name mismatch found. |
| Route ownership | No `/myiap` route, placeholder or feature registration remains in iap-admin. The package's source context/schema names and backend `/my/iap-ticket` paths remain required shared capabilities. |

Detailed component and dependency inventories:

- [Flow and host integration](final-audit-flow.md)
- [Window and shared primitives](final-audit-window.md)
- [Tickets and customer navigation](final-audit-tickets.md)
- [API, nested schemas, Persian translations and names](final-audit-contracts.md)

## Three corrections from this fresh audit

1. **Reference ghost button hover in dark mode.** Shared default ghost classes
   leaked `dark:hover:text-gray-50` into reference presentation, overriding the
   source Support header's hover color. CVA now selects ghost classes by
   presentation; the default public variant behavior is preserved. Three
   regressions cover default, reference and Support header override behavior.
2. **Mobile Support on register/password-reset.** Source auth shells include
   the Support open button in both footers. Admin only supplied it on Login.
   The shared optional `footerActions` slot now serves all three password-auth
   pages; the admin Register and PasswordReset hosts compose the source button.
   Mounted tests render the actual shared pages and verify public route context.
3. **Customer claim destination.** Source details use same-origin
   `/myiap/myclaims/{id}`. The user requires My-IAP in iap-app only and explicitly
   confirmed removal of `/myiap`. The link now resolves `/myclaims/{encoded-id}`
   against existing tenant `VITE_IAP_APP_DOMAIN_URL`, retaining new-tab attributes.
   Standalone unconfigured consumers use the approved same-origin pathname.
   This URL change is deliberate adaptation, not exact source URL identity.

After these corrections, no additional unapproved API, schema, translation,
component-name or inspected component-behavior discrepancy remains.

## Accepted boundaries and practical limits

- All paginated response content is `.nullish()`, even where source options
  reject null; present array items remain validated. This is the user's explicit
  workspace contract, not a reference validation accident.
- Customer pages are owned by iap-app. No admin compatibility route is restored.
  The customer detail journey is outside this Support task; no new iap-app page
  was implemented to service the corrected link.
- Global target theme supports explicit light/dark while source additionally
  accepts system preference. Supported-state Support colors match; global
  theme expansion remains outside this feature port.
- Public package imports, props-in-body, cn classes and provider/store/query
  ownership follow current architecture. Additional compatibility exports
  preserve existing iap-app callers without renaming the source components.
- No browser screenshot comparison or live-backend run was performed. This
  audit establishes file, contract, mounted-component and build evidence;
  it does not establish pixel identity or deployed customer-route availability.

## Final integrated verification

With `INSURANCE_UI_REFERENCE_PATH` pointing at the actual reference checkout:

- Support: **60 tests passed** across eight files.
- Admin focused Support contracts/content, panel routes and auth Support entry:
  **99 tests passed** across five files.
- Shared Button/date formatting: **7 tests passed** across two files.
- Total focused final verification: **166 tests passed**.
- Both app production builds and TypeScript checks passed; Auth, Support, UI and
  API types TypeScript checks passed.
- Scoped ESLint passed for Support, changed UI/Auth and admin integration files;
  the application-only `react-refresh/only-export-components` rule was disabled
  for public workspace-package exports. No new lint finding remains in scope.
- Architecture, scoped Prettier and diff whitespace checks passed.
- Builds retain Rollup warnings for Zod dependency comment annotations and large
  existing chunks. Builds completed successfully; bundle optimization is not
  claimed by this parity audit.
- The iap-app build's unrelated generated route-tree formatting changes were
  restored after confirming no route-semantic change.
