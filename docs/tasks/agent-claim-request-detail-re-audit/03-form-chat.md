# Form and objection-chat component audit

Reference root: `/home/sadegh/Android/project/insurance-ui/src`.
Target root: `apps/iap-admin/src` unless a workspace package is named.

## Tasks recorded before implementation

- [x] F1: `features/agent-claim-requests/components/agent-claim-request-objection-form.tsx` mounts source Textarea styles; target `pages/detail/components/agent-claim-request-objection-form.tsx` uses TextareaField without reference presentation. Opt into existing Textarea reference presentation (transparent background, three-pixel focus ring, source invalid/disabled styles).
- [x] F2: Source FormMessage (`components/ui/form.tsx`) has no alert role and suppresses fallback children whenever an error exists, even for an empty error message. Target attachments and description messages use default alert behavior. Forward reference presentation through TextareaField to its Textarea and FormMessage, and opt in for the attachments message. Preserve other consumers.
- [x] F3: Source global mutation handler (`main.tsx`, `utils/handle-server-error.ts`) uses source fallback and HTTP 304 literal. Target objection mutation does not select existing source error presentation metadata. Set `meta.errorPresentation` to `reference`; preserve global handling and mutation success sequencing.
- [x] C1: Source `components/objection-chat/objection-chat-card.tsx` uses `utils/format-date.ts`, throwing for truthy invalid timestamps. Target shared formatter silently returns a dash. Add scoped reference presentation to ObjectionChat/Card and select the public formatter invalid-date throw option, original language and non-normalized timezone. Parent detail page must forward reference presentation.

## Inspected components and equivalent behavior

- AgentClaimRequestObjectionForm: names, prop `isCompleteDoc`, translated label/placeholder/button keys, field order, grid item spacing, five textarea rows, empty defaults, upload pending blocking only submit, mutation pending blocking submit and description.
- Objection mutation: POST body construction uses loaded claim ID, trimmed formDescription, attachments, IN_ASSESSMENT; missing-ID toast and thrown validation_failed; awaited list invalidation then detail refetch, updated cache, success toast, reset. No feature-specific onError is added.
- myClaimRequestObjectionFormSchema: same exported name/type, declaration order, trimmed nonempty description, nonempty attachment list and translation keys. Attachment schema: identical nullish ID/metadata, all required file metadata, loose unknown-key retention. Schema issue-array fixtures will cover simultaneous failures and unknown-key output.
- FormItem/FormField/FormLabel/Label: source-equivalent rendered wrappers, grid gap, label classes, destructive label feedback and field subscription. FormControl: same ID, invalid and described-by values; target additional data-form-field metadata does not change source presentation.
- ObjectionChat: null/empty return, cloned ascending timestamp sort, key composition, auto-scroll effect, container classes/overflow.
- ObjectionChatCard: ENDUSER branching, bubble classes/alignment, date role text keys, separator, absence of attachment display. Props-in-body follows accepted target convention.
- Valid timestamps: Tehran conversion, exact Persian-language selection and patterns match source. Invalid-date behavior is covered by C1.
- FileUploader transport and mounted nested upload controls are delegated to the separate files task; this form uses its existing public module API.

## Accepted architecture adaptations

- AgentClaimRequestDetailResult uses `slice().sort()` instead of the source's in-place sort. Display order is identical; cached server data remains immutable under the accepted TanStack Query ownership rule. The frozen-data regression documents this deliberate side-effect difference.
- Feature mutation definitions live in `queries/`, translated schema in `model/`, and application callers consume shared form/file packages through their public APIs. Source component/schema names and runtime payloads are retained.
- FormControl uses a React 19 clone adapter instead of Radix Slot. Mounted textarea IDs, aria-invalid, aria-describedby and error links match; the target keeps inert `data-form-field` metadata. Ready-made TextareaField preserves the same source FormItem/FormLabel/control/FormMessage DOM with opt-in reference presentation.
- Scoped chat presentation keeps previous non-reference callers' invalid-date dash behavior. This agent detail page opts into the source throw behavior.

## Verification

- Admin scoped suite: 19 tests across objection form, schema, result and real ObjectionChat/Card passed.
- Forms scoped suite: 5 reference-message tests passed, including unchanged default textarea classes and alert semantics.
- Forms TypeScript check passed; scoped admin lint passed; `git diff --check` passed.
- Full application TypeScript/build/architecture checks are owned by the root integration task.
- Schema tests cover complete simultaneous empty-field issue arrays, missing attachment-field issue order, trim/strip output and retained loose attachment metadata. Form tests exercise real shared form/textarea primitives; the uploader remains mocked because its nested integration is verified by the files task.
- DOM/unit coverage does not establish screenshot or live-backend parity.
