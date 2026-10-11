import { z } from 'zod'

export const dashboardReportTabSchema = z.enum([
  'reportCountByAssigneeSummary',
  'reportCountByAssignee',
  'reportSumByAssignee',
  'reportDistributionByStatus',
  'agreementsWithoutMainAssessmentUser',
])

export type DashboardReportTab = z.infer<typeof dashboardReportTabSchema>

export const dashboardRouteSearchSchema = z
  .object({
    reportTab: dashboardReportTabSchema.optional(),
  })
  .catchall(z.union([z.string(), z.array(z.string()), z.undefined()]))

export type DashboardRouteSearch = z.infer<typeof dashboardRouteSearchSchema>
