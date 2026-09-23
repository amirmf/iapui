# Project continuity

Before implementation work, read `docs/architecture/APPLICATION-ARCHITECTURE.md` and the repository-local `.agents/skills` guidance relevant to the task.

- Preserve accepted user decisions and record durable architectural decisions in `docs/architecture/` when requested.
- Keep product requirements, UI decisions, and external reference material separate from implementation assumptions.
- The workspace is intentionally blank. Do not add files to either `src/app` directory until the user explicitly requests them.
- Keep route files thin. Business behavior belongs in `features`, reusable application capabilities in `modules`, and application-wide technical infrastructure in `shared`.
- Shared cross-application code belongs in a focused workspace package under `packages/`; consumers import only that package's public API.
- Compose conditional Tailwind/CSS classes with the public `cn` helper from `@iap/ui`; do not use template-literal interpolation or inline ternaries to assemble `className` values.
- All project documentation must be written in English.
