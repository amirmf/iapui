# Task 08 — Component-by-component reference audit

Compared every mounted source component against the target implementation using the exact source files.

## Findings

- `MyClaimRequestCard`: source is one named component; target additionally splits dates/actions for readability. Behavior must remain exact: document title fallback, status remapping, latest non-ENDUSER objection, amount zero preservation, conditional approved/paid/return dates, five delete statuses, RETURN attachment action, detail action and source border/badge classes.
- `MyClaimRequestsFilter`: source owns date parsing, status special mappings, policy/person fields, active-count calculation, clear behavior and collapsible UI. Target splits date/status controls but must preserve all mappings and policy exclusion. Source uses `CollapsibleTrigger` as a clickable div; target uses a semantic button as an accessibility correction.
- `MyClaimMyInsurancePolicyFormField`: source auto-selects first policy, clears person on policy change, never clears policy, excludes policy from submitted filters. Target preserves behavior through public `SearchableSelect` presentation.
- `MyClaimMyNationalCodeFormField`: source derives people from selected policy and appends the localized foreign marker. Target preserves this lookup dependency and labels.
- `MyClaimRequestPageHeader`: source defaults back link `/myiap/myclaims`; target canonical app route is `/myclaims/` per customer-portal architecture. The list page does not mount back button.
- `MyClaimRequestsAlert`: source links and translation keys are exact. Target uses public theme/UI packages and adds decorative icon `aria-hidden`.
- `MyClaimRequestDeleteDialog`: source uses feature store, direct delete mutation, non-awaited refetch, success toast, close then 500ms cleanup, and failed mutation stays open. Target uses public `@iap/dialogs` reference presentation, adds timer cleanup on unmount, and keeps source sequencing.
- `Pagination`: source hides when one page, has top/bottom borders and exact count/navigation keys. Target uses public UI `Button` reference presentation and preserves behavior.

## Acceptance

Source-visible behavior, API paths, translation keys and schema semantics take precedence. Architecture adaptations are limited to public workspace primitives, feature ownership, canonical app URLs and shared transport serialization. This audit is complete; implementation subtasks are tracked in `07-reference-audit-page.md` and existing component task records.
