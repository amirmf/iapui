import type { LucideIcon } from 'lucide-react'
import {
  Banknote,
  BrainCircuit,
  Building2,
  ClipboardCheck,
  FileChartColumn,
  FileText,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  MessageCircleQuestion,
  MessagesSquare,
  ReceiptText,
  Route,
  ScrollText,
  ShieldCheck,
  Stethoscope,
  Ticket,
  UserCog,
  UsersRound,
  Waypoints,
} from 'lucide-react'

export type AdminNavigationItem = {
  icon: LucideIcon
  titleKey: string
  to: string
}

export const adminNavigation: readonly AdminNavigationItem[] = [
  { icon: LayoutDashboard, titleKey: 'sidebar.dashboard', to: '/' },
  { icon: FileText, titleKey: 'sidebar.claimRequests', to: '/claim-requests/' },
  {
    icon: ReceiptText,
    titleKey: 'sidebar.medicalCenter',
    to: '/medical-center/',
  },
  { icon: Ticket, titleKey: 'sidebar.tickets', to: '/tickets/' },
  {
    icon: MessageCircleQuestion,
    titleKey: 'sidebar.supportQuestions',
    to: '/support-questions/',
  },
  { icon: ScrollText, titleKey: 'sidebar.agreements', to: '/agreements/' },
  { icon: UserCog, titleKey: 'sidebar.subUsers', to: '/sub-users/' },
  { icon: UsersRound, titleKey: 'sidebar.parties', to: '/user-account/' },
  { icon: Banknote, titleKey: 'sidebar.bankAccounts', to: '/bank-account/' },
  {
    icon: ClipboardCheck,
    titleKey: 'sidebar.assessmentPrompts',
    to: '/assessment-prompts/',
  },
  {
    icon: BrainCircuit,
    titleKey: 'sidebar.aiAssessmentRules',
    to: '/ai-assessment-rules/',
  },
  {
    icon: MessagesSquare,
    titleKey: 'sidebar.repetitiveResponses',
    to: '/repetitive-responses/',
  },
  { icon: ShieldCheck, titleKey: 'sidebar.coverages-maxa', to: '/coverages/' },
  {
    icon: HeartPulse,
    titleKey: 'sidebar.personSpecialDiseases',
    to: '/person-special-diseases/',
  },
  { icon: Building2, titleKey: 'sidebar.branches', to: '/branches/' },
  { icon: Stethoscope, titleKey: 'sidebar.damageCodes', to: '/damage-codes/' },
  {
    icon: Route,
    titleKey: 'sidebar.assignementRules',
    to: '/assignement-rules/',
  },
  { icon: FileChartColumn, titleKey: 'sidebar.docTypes', to: '/doc-types/' },
  { icon: MessagesSquare, titleKey: 'sidebar.otp', to: '/otp/' },
  {
    icon: FileChartColumn,
    titleKey: 'sidebar.claimReports',
    to: '/claim-reports/',
  },
  { icon: Waypoints, titleKey: 'sidebar.pipelines', to: '/pipelines/' },
  {
    icon: Hospital,
    titleKey: 'sidebar.outpatientDocAcceptances',
    to: '/outpatient-doc-acceptances/',
  },
]
