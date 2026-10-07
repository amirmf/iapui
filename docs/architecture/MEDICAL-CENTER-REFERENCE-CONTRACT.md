# Medical Center reference contract

The user explicitly requires exact source contract semantics for Medical Center invoices (2026-10-06). Domain-specific schemas retain the reference defaults, nullish page content, string-only filters, unknown-key stripping and nested validation. This is scoped to Medical Center and does not alter strict request requirements or common pagination schemas elsewhere. Nullable/optional fields use equivalent Zod v4 nullish notation. Backend contracts remain in @iap/api-types; UI/router ownership remains in iap-admin features and route adapters.

The workspace-wide 2026-10-07 content decision supersedes source-specific
null rejection: response page `content` uses `.nullish()` and consumers treat
missing or null content as an empty collection.
