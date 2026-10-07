# Task 02 — constants and localization

Reference: `insurance-ui/src/constants/tickets-constant.ts` and the `tickets` object in `insurance-ui/src/locales/fa.json`.

Target owners: `apps/iap-admin/src/features/tickets/constants/tickets-constant.ts` and `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

Keep typed maps for status (`OPEN`, `ASSIGNED`, `WAITING_FOR_USER`, `WAITING_FOR_SUPPORT`, `ANSWERED`, `CLOSED`), priority (`LOW`, `NORMAL`, `HIGH`, `URGENT`), and category (`PAYMENT`, `CLAIM_ISSUE`, `INFO_ISSUE`). Preserve reference translation key names, Persian values, badge classes, and option order. UI components consume these maps; they must not contain enum switches or duplicated labels.

Acceptance: locale values are copied from the reference byte-for-byte for the mounted closure, map keys cover the complete source enums, and option factories use the active `t` function.
