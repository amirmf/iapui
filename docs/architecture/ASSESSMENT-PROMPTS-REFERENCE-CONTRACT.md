# Assessment prompts reference contract decision

## Scope and accepted decision

On 2026-10-06 the user explicitly chose the inspected insurance-ui contract for
the admin `/assessment-prompts/` page, including API/schema/component names,
translation values and validation semantics. Existing architecture continues to
govern ownership, import boundaries, route thickness and shared capability reuse.

This is a domain-specific exception to the general strict-request and common
page-factory guidance in `APPLICATION-ARCHITECTURE.md`. It does not authorize
changing Agreements or another domain's accepted contracts.

## Contract implications

- Assessment request objects strip unknown keys; assessment page `content` is
  nullable/optional. Nested page objects strip unknown keys while the full
  assessment response retains unknown root properties as in the source.
- Canonical schema names, field order, UUID/integer checks and literal form
  validation errors match the inspected source. Do not infer Persian validation
  messages that the source form does not show.
- Use shared page factories only when they preserve these semantics, including
  validation issue order. The assessment contracts use explicit source-backed
  definitions in the public `@iap/api-types` domain entry point.
- The agreement lookup and nested response use source-backed agreement data;
  integration must preserve the public contracts used by the Agreements feature.

## Reuse for future pages

Before implementing another source-parity page, read
`.agents/skills/reference-page-parity/SKILL.md` and the current public capability
inventory in `REFERENCE-PAGE-CONTROLS.md`. Do not copy this page's exceptions,
debounce values, endpoint defaults or source bugs as universal policy.

Trace the actual mounted closure, including reusable confirmations and their
date controls, not just the feature JSX. Preserve existing default consumers
through scoped reference presentation. Keep enum label maps separate from API
schemas, and copy locale values programmatically from mounted source keys.

Task evidence and verification limits remain in `docs/tasks/assessment-prompts/`.
Selected-only deletion, retry behavior, validated storage and safe invalid-date
formatting are disclosed safeguards rather than assertions of identical source
failure behavior. No live-backend or screenshot parity is established by unit
tests, schema comparisons, typechecks or builds.
