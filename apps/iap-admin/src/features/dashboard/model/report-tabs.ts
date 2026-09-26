export const reportTabs = [
  'reportCountByAssigneeSummary',
  'reportCountByAssignee',
  'reportSumByAssignee',
  'reportDistributionByStatus',
  'agreementsWithoutMainAssessmentUser',
] as const

export type ReportTab = (typeof reportTabs)[number]

export function isReportTab(value: string | undefined): value is ReportTab {
  return reportTabs.includes(value as ReportTab)
}
