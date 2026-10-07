# TASK-09: Release Assignments Dialog

## Objective
Implement `SubUserReleaseAssignmentsDialog` using `@iap/dialogs`'s `ConfirmDialog` to confirm releasing a user's assigned claims cartable.

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-user-release-assignments-dialog.tsx`

## Implementation Target
- `apps/iap-admin/src/features/sub-users/components/sub-user-release-assignments-dialog.tsx`

## Detailed Specifications
- Leverages `ConfirmDialog` from `@iap/dialogs`.
- Title: `t('subUsers.releaseAssignments.title')`
- Description: `t('subUsers.releaseAssignments.description', { user: currentRow?.displayName ?? currentRow?.username ?? '' })`
- Confirm label: `t('subUsers.releaseAssignments.confirm')`
- Variant: `destructive`
- On confirm: Triggers `subUserService.releaseAssignments({ userId: currentRow.id })`.
- On success: Shows toast notification `subUsers.messages.releaseAssignmentsSuccess`, invalidates query `['sub-users']`, and closes dialog.

## Acceptance Criteria
- [ ] Safe null checking on `currentRow?.id`.
- [ ] Accessible confirmation modal with cancel button and loading indicator.
- [ ] Prevents modal dismissal while mutation is pending.
