# Task 05 — detail sheet and mutations

Reference components: `ticket-detail-sheet`, its header/actions, readonly detail, communication column, message list/message, related claim-request column, and status-history dialog.

Target owners: matching files under `apps/iap-admin/src/features/tickets/components/`, with state in `context/store/ticket-store.ts` and `context/provider/ticket-provider.tsx`.

Open the sheet from a row, load the selected ticket and paginated messages, preserve source disabled states, and validate message/close/assign requests through the service. On successful mutation, refetch ticket/messages and the parent list in source order, then close the sheet. Keep status-history labels, dates, visibility badges, and sender presentation source-backed. Compose the existing public ClaimRequestReadonlyInfoList and AssessmentItemsCardList capabilities; start assessment and claim queries concurrently as the source does.

Acceptance: provider resets on unmount, mutation failures keep controls open, success sequencing is tested, and detail/message schemas reject malformed data.
