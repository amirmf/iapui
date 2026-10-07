> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

# Fresh flow, names, localization and host audit

This audit supersedes the initial flow/integration evidence. Source files were re-read directly, and source/target TypeScript was transpiled to comparable JavaScript after import and component-props placement normalization.

## File coverage

- `store/support-flow-store.ts`: normalized runtime equals target `context/store/support-flow-store.ts`.
- `utils/support-flow-context.ts`: normalized runtime equals target `model/support-flow-context.ts`; source patterns, IDs, page keys and flag semantics preserved.
- `components/icon-bot.tsx` and `support-flow-provider.tsx`: normalized runtime equal; provider lives under target `context/provider/`.
- `components/support-flow-widget.tsx`, `support-flow-open-button.tsx`, `support-floating-button.tsx`, `support-feature-button.tsx`, `support-question-button.tsx`: names, props, defaults, conditions, handlers and source classes inspected individually. Public theme store replaces reference theme context, scoped shared primitive presentations reproduce source classes, class sorting/empty JSX comment removal has no rendered effect.
- `components/support-flow-types.ts`: declarations match the source in target `model/support-flow-types.ts`; source label/key fallbacks, LIST/TEXT/NOINPUT branches and mapping implementation stay in the compatibility component helper entry.
- The additional SupportWidget/SupportNavigationButton entries intentionally preserve existing consumer public APIs; they do not rename source components.

## Verified correction: trailing-slash auth routing

Source `main.tsx` does not set `trailingSlash: 'always'`, while the accepted target router does. The unchanged source context utility considers only `/login` public (not `/login/`). Consequently the target login widget could call `/support/my/answer` instead of `/support/answer` on its canonical path.

Fix at the target Router adapter boundary: normalize trailing slashes before delegating to the unchanged source context utility. Both SupportFlowWidget and SupportFlowOpenButton consume that adapter. Preserve source page keys and public service contracts; test the actual widget mounted under a canonical memory Router and its endpoint selection. No My-IAP journey implementation is introduced.

## Localization verification

Fresh extraction and comparison covers the entire source supportFlow subtree, every literal t() key in the mounted source closure and dynamic field/status mappings. Verify both iap-admin and iap-app consumer locales; source-absent literal fallbacks must remain source-absent. Detailed results and final checks belong to `reaudit.md`.

## Exact declared component-name inventory

Checked real TypeScript function declarations/expressions, excluding commented-out code. All 24 source component implementation files retain their declared React function names (public and private).

| Source path under features/support | Target path under packages/support/src | Names |
| --- | --- | --- |
| `components/icon-bot.tsx` | `components/icon-bot.tsx` | `IconBot` |
| `components/support-feature-button.tsx` | `components/support-feature-button.tsx` | `SupportFeatureButton` |
| `components/support-floating-button.tsx` | `components/support-floating-button.tsx` | `SupportFloatingButton` |
| `components/support-flow-open-button.tsx` | `components/support-flow-open-button.tsx` | `SupportFlowOpenButton` |
| `components/support-flow-provider.tsx` | `context/provider/support-flow-provider.tsx` | `SupportFlowProvider` |
| `components/support-flow-widget.tsx` | `components/support-flow-widget.tsx` | `SupportFlowWidget` |
| `components/support-flow-window/index.tsx` | `components/support-flow-window/index.tsx` | `SupportFlowWindow` |
| `components/support-flow-window/support-flow-message.tsx` | `components/support-flow-window/support-flow-message.tsx` | `SupportFlowMessage` |
| `components/support-flow-window/support-flow-user-message.tsx` | `components/support-flow-window/support-flow-user-message.tsx` | `SupportFlowUserMessage` |
| `components/support-flow-window/support-flow-window-actions.tsx` | `components/support-flow-window/support-flow-window-actions.tsx` | `SupportFlowWindowActions` |
| `components/support-flow-window/support-flow-window-error.tsx` | `components/support-flow-window/support-flow-window-error.tsx` | `SupportFlowWindowError` |
| `components/support-flow-window/support-flow-window-header.tsx` | `components/support-flow-window/support-flow-window-header.tsx` | `SupportFlowWindowHeader` |
| `components/support-flow-window/support-flow-window-loading.tsx` | `components/support-flow-window/support-flow-window-loading.tsx` | `SupportFlowWindowLoading` |
| `components/support-flow-window/support-option-list.tsx` | `components/support-flow-window/support-option-list.tsx` | `SupportOptionList` |
| `components/support-flow-window/support-option-row.tsx` | `components/support-flow-window/support-option-row.tsx` | `SupportOptionLoadingRow`, `SupportOptionRow` |
| `components/support-flow-window/support-question-list-item.tsx` | `components/support-flow-window/support-question-list-item.tsx` | `SupportQuestionListItem` |
| `components/support-flow-window/support-response-option-list-item.tsx` | `components/support-flow-window/support-response-option-list-item.tsx` | `SupportResponseOptionListItem` |
| `components/support-flow-window/support-text-input.tsx` | `components/support-flow-window/support-text-input.tsx` | `SupportTextInput` |
| `components/support-question-button.tsx` | `components/support-question-button.tsx` | `SupportQuestionButton` |
| `components/tickets/recent-tickets.tsx` | `components/tickets/recent-tickets.tsx` | `RecentTickets`, `RecentTicketsSkeleton` |
| `components/tickets/support-ticket-conversation.tsx` | `components/tickets/support-ticket-conversation.tsx` | `MessagesError`, `MessagesSkeleton`, `SupportTicketConversation`, `SupportTicketMessageEntry` |
| `components/tickets/support-ticket-details.tsx` | `components/tickets/support-ticket-details.tsx` | `DetailsError`, `SupportTicketDetails`, `TicketDetailValue`, `TicketDetailsSkeleton` |
| `components/tickets/support-ticket-item.tsx` | `components/tickets/support-ticket-item.tsx` | `SupportTicketItem` |
| `components/tickets/support-tickets-list.tsx` | `components/tickets/support-tickets-list.tsx` | `SupportTicketListRow`, `SupportTicketsList`, `TicketListState`, `TicketsListSkeleton` |

Final integrated checks after all audit corrections are recorded in [reaudit.md](reaudit.md).
