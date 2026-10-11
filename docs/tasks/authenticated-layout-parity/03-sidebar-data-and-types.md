# Task 03: Sidebar Data & Types Parity

## Reference

- `insurance-ui/src/components/layout/types.ts`
- `insurance-ui/src/components/layout/data/sidebar-data.ts`

## Deliverables

1. **`types.ts`**:
   - Location: `apps/iap-admin/src/shared/app-shell/types.ts`
   - Data contracts:
     - `User`: `{ name: string; email: string; avatar: string }`
     - `Team`: `{ name: string; logo: React.ElementType; plan: string }`
     - `BaseNavItem`: `{ title: string; badge?: string; icon?: React.ElementType; filter?: Record<string, unknown>; matchDescendants?: boolean }`
     - `NavLink`: `BaseNavItem & { url: string; items?: never }`
     - `NavCollapsible`: `BaseNavItem & { items: (BaseNavItem & { url: string })[]; url?: never }`
     - `NavItem`: `NavCollapsible | NavLink`
     - `NavGroup`: `{ title?: string | null; items: NavItem[] }`
     - `SidebarData`: `{ user: User; teams: Team[]; navGroups: NavGroup[] }`

2. **`useSidebarData`**:
   - Location: `apps/iap-admin/src/shared/app-shell/data/sidebar-data.ts`
   - All 22 navigation items with exact URL paths, icons, and translation keys:
     1. Dashboard: `url: '/'`, `icon: LayoutDashboard`, `title: t('sidebar.dashboard')`
     2. Claim Requests: `url: '/claim-requests'`, `icon: FileText`, `title: t('sidebar.claimRequests')`
     3. Medical Center: `url: '/medical-center'`, `icon: Building2`, `title: t('sidebar.medicalCenter')`
     4. Tickets: `url: '/tickets'`, `icon: Ticket`, `title: t('sidebar.tickets')`
     5. Support Questions: `url: '/support-questions'`, `icon: MessageCircleQuestion`, `title: t('sidebar.supportQuestions')`
     6. Agreements: `url: '/agreements'`, `icon: ScrollText`, `title: t('sidebar.agreements')`
     7. Sub Users: `url: '/sub-users'`, `icon: UserCog`, `title: t('sidebar.subUsers')`
     8. Parties / User Account: `url: '/user-account'`, `icon: UsersRound`, `title: t('sidebar.parties')`
     9. Bank Accounts: `url: '/bank-account'`, `icon: Banknote`, `title: t('sidebar.bankAccounts')`
     10. Assessment Prompts: `url: '/assessment-prompts'`, `icon: ClipboardCheck`, `title: t('sidebar.assessmentPrompts')`
     11. AI Assessment Rules: `url: '/ai-assessment-rules'`, `icon: BrainCircuit`, `title: t('sidebar.aiAssessmentRules')`
     12. Repetitive Responses: `url: '/repetitive-responses'`, `icon: MessagesSquare`, `title: t('sidebar.repetitiveResponses')`
     13. Coverages: `url: '/coverages'`, `icon: ShieldCheck`, `title: t('sidebar.coverages-maxa')`
     14. Special Diseases: `url: '/special-diseases'`, `icon: HeartPulse`, `title: t('sidebar.specialDiseases')`
     15. Person Special Diseases: `url: '/person-special-diseases'`, `icon: HeartPulse`, `title: t('sidebar.personSpecialDiseases')`
     16. Branches: `url: '/branches'`, `icon: Building2`, `title: t('sidebar.branches')`
     17. Damage Codes: `url: '/damage-codes'`, `icon: Stethoscope`, `title: t('sidebar.damageCodes')`
     18. Assignment Rules: `url: '/assignement-rules'`, `icon: Route`, `title: t('sidebar.assignementRules')`
     19. Document Types: `url: '/doc-types'`, `icon: FileChartColumn`, `title: t('sidebar.docTypes')`
     20. OTP: `url: '/otp'`, `icon: MessagesSquare`, `title: t('sidebar.otp')`
     21. Claim Reports: `url: '/claim-reports'`, `icon: FileChartColumn`, `filter: { status: 'SUCCESS' }`, `title: t('sidebar.claimReports')`
     22. Pipelines: `url: '/pipelines'`, `icon: Waypoints`, `title: t('sidebar.pipelines')`
     23. Outpatient Doc Acceptances: `url: '/outpatient-doc-acceptances'`, `icon: Hospital`, `title: t('sidebar.outpatientDocAcceptances')`

## Verification Criteria

- Types check cleanly: `pnpm --filter iap-admin typecheck`.
- URLs and query filters match `insurance-ui` exactly.
