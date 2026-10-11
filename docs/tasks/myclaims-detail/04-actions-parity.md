# Detail action parity

Priority: P1. Sources: `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-detail-actions.tsx` and `my-claim-request-detail-delete-action.tsx`.

- [x] Restore both exact component names, status gates, delete icon/label and adjustment action.
- [x] Restore confirmation title icon, description, destructive variant, pending state, exact translation keys.
- [x] On success await reference list invalidation, await reference detail invalidation, display delete success, close dialog, navigate back.
- [x] Also invalidate actual target cache keys to refresh existing list/detail consumers; reference keys are retained in their original order.
- [x] Preserve adjustment management path and new-tab action. Since that route belongs to `iap-admin`, use the existing configured admin origin instead of adding a route to `iap-app`.
- [x] Verify rejection keeps confirmation open and successful invalidation precedes navigation.

Evidence: eight focused action/delete tests cover five eligible statuses, hidden actions, adjustment URL, failure, and awaited success ordering. Full verification results are in `reference-parity-audit.md`.
