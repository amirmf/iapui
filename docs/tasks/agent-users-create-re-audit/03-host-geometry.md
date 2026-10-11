# 03 — Signup host geometry

Source: insurance-ui `src/components/layout/agent-layout.tsx:25–39`; target `apps/iap-admin/src/shared/app-shell/agent-layout.tsx:43–63`.

Verified differences:

- Source host uses horizontal padding 8px at all widths; target host uses 16px at sm and above.
- Source page mounts directly after Header within flex gap-6. Target mounts inside an additional main with max-width 1600px and py-6, producing nested main elements and an extra 24px bottom pad.
- Source host vertical padding is 8px on mobile and 16px from sm. Preserve those values.

Task: opt into source content-host padding only for canonical `/agent/users/create` with either trailing-slash form. Mount this page in a div with pt-6 to reproduce header-to-page gap, without the extra bottom padding, max-width or nested main. Other agent pages retain their existing wrapper. Keep page's own source main/container/max-w-xl/pb-5 unchanged.

The sidebar and header are existing application shell capabilities shared by panel pages. Their menu/session composition is not reimplemented by this single-page feature. Existing target sidebar breakpoint/width and mandatory auth dialogs remain architectural host differences and must be reported separately from page surface parity.

Acceptance: scoped wrapper regression checks plus existing panel-route coverage and architecture check.

Status: implemented. Three host regression tests pass for both signup URL forms and an unchanged agent claim-list host. Panel route coverage passes. Browser screenshots were not captured.
