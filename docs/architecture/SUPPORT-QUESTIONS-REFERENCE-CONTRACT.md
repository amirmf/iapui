# Support Questions Reference Contract Decision

## Scope and Accepted Decision

On 2026-10-07, the user explicitly chose the inspected `insurance-ui` contract for the admin `/support-questions/` page, including component names, API endpoints, Zod schemas, enum translations, and validation semantics. Existing `APPLICATION-ARCHITECTURE.md` conventions govern ownership, import boundaries, route thickness, and shared capability reuse.

## Architecture and Contract Implications

### 1. Composite Multi-Panel Page Architecture
- The page composes three distinct entities under a single root route (`/_authenticated/support-questions`):
  - **Support Questions (Primary Top Section):** Full-width layout, URL-synchronized query parameters (`useTableFilterQueryParams`), row selection, bulk delete dialog, view dialog, and create/edit form dialog with integrated rich markdown editor.
  - **Support Pages & Features (Secondary Bottom Grid):** Responsive two-column layout (`grid gap-6 lg:grid-cols-2`), local pagination state (`pageSize: 10`), sorting, refresh, and standalone create/edit/delete dialogs.
- **State Isolation & Lifecycle:** Each entity owns an independent Zustand store and lifecycle provider (`SupportQuestionProvider`, `SupportPageProvider`, `SupportFeatureProvider`) that resets on component unmount to prevent state leakage and cross-entity interference.

### 2. API Endpoints & Request/Response Contracts
- Contracts are centralized in `@iap/api-types/src/support/index.ts`:
  - `supportQuestionSchema`, `pageSupportQuestionSchema`, `supportQuestionPayloadSchema`, `createSupportQuestionSchema`, `updateSupportQuestionSchema`
  - `supportPageSchema`, `pageSupportPageSchema`, `supportPagePayloadSchema`, `updateSupportPageSchema`
  - `supportFeatureSchema`, `pageSupportFeatureSchema`, `supportFeaturePayloadSchema`, `updateSupportFeatureSchema`
- Endpoints:
  - Questions: `GET /support/questions/page`, `GET /support/questions/page-full`, `GET /support/questions/:id`, `POST /support/questions`, `PUT /support/questions/:id`, `DELETE /support/questions/:id`, `DELETE /support/questions/bulk-delete`
  - Pages: `GET /support/pages/page`, `POST /support/pages`, `PUT /support/pages/:id`, `DELETE /support/pages/:id`
  - Features: `GET /support/features/page`, `POST /support/features`, `PUT /support/features/:id`, `DELETE /support/features/:id`

### 3. Rich Markdown Editor Encapsulation
- Ported and colocated directly inside `src/features/support-questions/components/markdown-editor/` rather than adding a top-level shared component before wide reuse is approved.
- Implemented with `@tiptap/react` and `@iap/ui` primitives (Buttons, Popovers, Inputs, Separators).
- Sanitizes link URLs to permit only safe protocols (`http:`, `https:`, `mailto:`, `tel:`) preventing XSS or script injection.

### 4. Shared Confirmation & Form Controls
- Confirmations use `@iap/dialogs` `ConfirmDialog` with `presentation='reference'` for visual and functional parity.
- Input display and party role enum translation keys and status badge colors are centralized in `features/support-questions/constants/support-question-constant.ts`.
