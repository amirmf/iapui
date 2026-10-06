import type { AiAssessmentRuleDetail } from '@iap/api-types'

export function replaceRuleDetail(
  ruleDetails: AiAssessmentRuleDetail[],
  currentDetail: AiAssessmentRuleDetail,
  nextDetail: AiAssessmentRuleDetail
): AiAssessmentRuleDetail[] {
  const index = ruleDetails.indexOf(currentDetail)
  return index === -1
    ? ruleDetails
    : ruleDetails.map((detail, detailIndex) =>
        detailIndex === index ? nextDetail : detail
      )
}
