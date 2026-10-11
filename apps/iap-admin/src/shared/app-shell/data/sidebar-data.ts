import {
  Banknote,
  BrainCircuit,
  Building2,
  ClipboardCheck,
  Command,
  FileChartColumn,
  FileText,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  MessageCircleQuestion,
  MessagesSquare,
  Route,
  ScrollText,
  ShieldCheck,
  Stethoscope,
  Ticket,
  UserCog,
  UsersRound,
  Waypoints,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SidebarData } from '../types'

export const useSidebarData = (): SidebarData => {
  const { t } = useTranslation()

  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: t('system.assessment'),
        logo: Command,
        plan: 'Rabin',
      },
    ],
    navGroups: [
      {
        title: null,
        items: [
          {
            title: t('sidebar.dashboard'),
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: t('sidebar.claimRequests'),
            url: '/claim-requests',
            icon: FileText,
          },
          {
            title: t('sidebar.medicalCenter'),
            url: '/medical-center',
            icon: Building2,
          },
          {
            title: t('sidebar.tickets'),
            url: '/tickets',
            icon: Ticket,
          },
          {
            title: t('sidebar.supportQuestions'),
            url: '/support-questions',
            icon: MessageCircleQuestion,
          },
          {
            title: t('sidebar.agreements'),
            url: '/agreements',
            icon: ScrollText,
          },
          {
            title: t('sidebar.subUsers'),
            url: '/sub-users',
            icon: UserCog,
          },
          {
            title: t('sidebar.parties'),
            url: '/user-account',
            icon: UsersRound,
          },
          {
            title: t('sidebar.bankAccounts'),
            url: '/bank-account',
            icon: Banknote,
          },
          {
            title: t('sidebar.assessmentPrompts'),
            url: '/assessment-prompts',
            icon: ClipboardCheck,
          },
          {
            title: t('sidebar.aiAssessmentRules'),
            url: '/ai-assessment-rules',
            icon: BrainCircuit,
          },
          {
            title: t('sidebar.repetitiveResponses'),
            url: '/repetitive-responses',
            icon: MessagesSquare,
          },
          {
            title: t('sidebar.coverages-maxa'),
            url: '/coverages',
            icon: ShieldCheck,
          },
          {
            title: t('sidebar.specialDiseases'),
            url: '/special-diseases',
            icon: HeartPulse,
          },
          {
            title: t('sidebar.personSpecialDiseases'),
            url: '/person-special-diseases',
            icon: HeartPulse,
          },
          {
            title: t('sidebar.branches'),
            url: '/branches',
            icon: Building2,
          },
          {
            title: t('sidebar.damageCodes'),
            url: '/damage-codes',
            icon: Stethoscope,
          },
          {
            title: t('sidebar.assignementRules'),
            url: '/assignement-rules',
            icon: Route,
          },
          {
            title: t('sidebar.docTypes'),
            url: '/doc-types',
            icon: FileChartColumn,
          },
          {
            title: t('sidebar.otp'),
            url: '/otp',
            icon: MessagesSquare,
          },
          {
            title: t('sidebar.claimReports'),
            url: '/claim-reports',
            icon: FileChartColumn,
            filter: {
              status: 'SUCCESS',
            },
          },
          {
            title: t('sidebar.pipelines'),
            url: '/pipelines',
            icon: Waypoints,
          },
          {
            title: t('sidebar.outpatientDocAcceptances'),
            url: '/outpatient-doc-acceptances',
            icon: Hospital,
          },
        ],
      },
    ],
  }
}
