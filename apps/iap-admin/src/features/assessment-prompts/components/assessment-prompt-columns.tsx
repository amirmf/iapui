import { useMemo } from 'react'

import { AssessmentPromptEnumBadge } from '@features/assessment-prompts/components/assessment-prompt-enum-badge'
import { AssessmentPromptRowActions } from '@features/assessment-prompts/components/assessment-prompt-row-actions'
import {
  ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS,
  ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS,
  ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS,
} from '@features/assessment-prompts/constants/assessment-prompts-constant'
import type { AssessmentPrompt } from '@iap/api-types'
import { LongText } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { formatDateTime } from '@shared/lib/format-date'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

const helper = createColumnHelper<AssessmentPrompt>()

export function useAssessmentPromptColumns() {
  const { t } = useTranslate()
  return useMemo(
    () => [
      helper.accessor('title', {
        cell: (context) => (
          <LongText presentation='reference' className='max-w-48 font-medium'>
            {context.getValue()}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.title')}
          />
        ),
      }),
      helper.accessor('prompt', {
        cell: (context) => (
          <LongText presentation='reference' className='max-w-64'>
            {context.getValue()}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.prompt')}
          />
        ),
      }),
      helper.accessor('docTypeCode', {
        cell: (context) => (
          <LongText presentation='reference' className='max-w-40'>
            {context.getValue() ?? t('common.notAvailable')}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.docType')}
          />
        ),
      }),
      helper.accessor('placeType', {
        filterFn: (row, id, value: string[]) =>
          value.includes(row.getValue(id)),
        cell: (context) => (
          <AssessmentPromptEnumBadge
            translationKey={
              context.getValue()
                ? ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS[
                    context.getValue()!
                  ]
                : undefined
            }
            value={context.getValue()}
          />
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.placeType')}
          />
        ),
      }),
      helper.accessor(
        (row) => {
          const title = row.agreement?.title?.trim()
          const code = row.agreement?.code?.trim()
          return title && code
            ? `${title} - ${code}`
            : (title ?? code ?? row.agreementId ?? null)
        },
        {
          enableSorting: false,
          id: 'agreement',
          cell: (context) => (
            <LongText presentation='reference' className='max-w-48'>
              {context.getValue() ?? t('common.notAvailable')}
            </LongText>
          ),
          header: ({ column }) => (
            <DataTableColumnHeader
              presentation='reference'
              column={column}
              title={t('assessmentPrompts.columns.agreement')}
            />
          ),
        }
      ),
      helper.accessor('ruleState', {
        filterFn: (row, id, value: string[]) =>
          value.includes(row.getValue(id)),
        enableSorting: false,
        cell: (context) => (
          <AssessmentPromptEnumBadge
            translationKey={
              context.getValue()
                ? ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS[
                    context.getValue()!
                  ]
                : undefined
            }
            value={context.getValue()}
          />
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.ruleState')}
          />
        ),
      }),
      helper.accessor('status', {
        filterFn: (row, id, value: string[]) =>
          value.includes(row.getValue(id)),
        enableSorting: false,
        cell: (context) => (
          <AssessmentPromptEnumBadge
            translationKey={
              context.getValue()
                ? ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS[context.getValue()!]
                : undefined
            }
            value={context.getValue()}
          />
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.status')}
          />
        ),
      }),
      helper.accessor('thruDate', {
        cell: (context) => (
          <div className='w-24 text-sm'>
            {formatDateTime(context.getValue())}
          </div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t('assessmentPrompts.columns.thruDate')}
          />
        ),
      }),
      helper.display({
        cell: ({ row }) => <AssessmentPromptRowActions row={row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
      helper.display({
        cell: () => null,
        enableSorting: false,
        header: () => null,
        id: 'agreement.title',
        meta: { className: 'hidden' },
      }),
      helper.display({
        cell: () => null,
        enableSorting: false,
        header: () => null,
        id: 'agreement.code',
        meta: { className: 'hidden' },
      }),
    ],
    [t]
  )
}
