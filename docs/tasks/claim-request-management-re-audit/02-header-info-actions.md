# Header, information, and action parity audit

Reference: `insurance-ui/src/features/claim-requests/components/*` and the management page action components.
Target: `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/*`.

## Verified component parity

- `ClaimRequestLastStatusSection`: status fallback, paid/sent-to-bank display mapping, reverse status-history dialog ordering, disabled state, translation keys, and badge classes match the reference. The target adds the required shared UI `presentation="reference"` marker.
- `ClaimRequestAssignSection`: assigned-user fallback chain, no-assignment label, company assessment label, and badge classes match the reference. Shared UI presentation markers are target architecture details.
- `ClaimRequestRegisteredByAgentSection`: display-name/username composition, empty suppression, translation key, and badge classes match the reference.
- `ClaimRequestManagementActionBtn`: the three reference mutations (Core AI start, Core AI approval placeholder, policy refresh), permission gate, confirmation flow, loading lock, toast keys, and refetch behavior match the reference. Target service and auth imports are the architecture equivalents.
- `ClaimRequestInfoList`: Fanavaran empty-state inquiry, adjustment link, update-info permission condition, inquiry mutation, and translation keys match the reference. Route literals include the target router's trailing slash.
- `ClaimRequestInfoListCard`, `ClaimRequestInfoListContent`, and `ClaimRequestReadonlyInfoList`: field order, labels, fallback values, date/amount formatting, special-disease filtering and colors, IBAN translation mapping, and mobile/adjustment trailing actions match the reference.

## Discrepancy found and fixed

`ClaimRequestInfoListContent` imported `react-i18next` directly, bypassing the target application's shared i18n boundary. It now uses `useTranslate` from `@shared/i18n/i18n` while preserving the same `t` and `i18n` behavior and all reference translation keys.

No API path, request payload, schema, component name, or translation-key mismatch was found in this scope. No reference behavior was invented or changed.
