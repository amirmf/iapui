import type { AiAssessmentRule } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'

import { AiAssessmentRuleAutomationLevelsTable } from './ai-assessment-rule-automation-levels-table'
import { AiAssessmentRuleDetailsTable } from './ai-assessment-rule-details-table'

interface AiAssessmentRuleInspectorProps {
  onRefresh: () => void
  rule: AiAssessmentRule | undefined
}

export function AiAssessmentRuleInspector({
  onRefresh,
  rule,
}: AiAssessmentRuleInspectorProps) {
  const { t } = useTranslate()

  if (!rule) {
    return (
      <aside className='text-sm text-muted-foreground xl:sticky xl:top-4'>
        {t('aiAssessmentRules.inspector.empty')}
      </aside>
    )
  }

  return (
    <aside className='space-y-4 xl:sticky xl:top-4'>
      <section className='space-y-2'>
        <h3 className='text-base font-semibold'>
          {t('aiAssessmentRules.inspector.ruleDetails')}
        </h3>
        <AiAssessmentRuleDetailsTable onRefresh={onRefresh} rule={rule} />
      </section>
      <section className='space-y-2'>
        <h3 className='text-base font-semibold'>
          {t('aiAssessmentRules.fields.automationLevels')}
        </h3>
        <AiAssessmentRuleAutomationLevelsTable
          onRefresh={onRefresh}
          rule={rule}
        />
      </section>
    </aside>
  )
}
