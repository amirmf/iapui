import { useCallback } from 'react'

import { type TicketStatus } from '@iap/api-types'
import { formatDate } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import {
  type SupportFlowListItem,
  type SupportFlowResponseOptionItem,
} from '../support-flow-types'
import { formatAmount } from './support-option-format'
import {
  SUPPORT_OPTION_FIELDS,
  type SupportOptionDetail,
  type SupportOptionField,
} from './support-option-list-types'
import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP,
  type ClaimRequestStatus,
} from './support-option-status'
import { TICKET_STATUS_TRANSLATION_KEYS } from './support-option-status'

const hasDisplayValue = (value: unknown) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

export function useSupportOptionDetails() {
  const { t: translation, i18n } = useTranslation()
  const t = translation as unknown as (key: string) => string

  const getOptionFieldValue = useCallback(
    (option: SupportFlowResponseOptionItem, field: SupportOptionField) => {
      const value = option[field]

      if (!hasDisplayValue(value)) return null

      if (field === 'amount') return formatAmount(value) ?? String(value)
      if (field === 'submitDate')
        return formatDate(value as string, undefined, {
          language: i18n.language,
          normalizeTimezone: false,
          invalidDate: 'throw',
        })
      if (field === 'status') {
        const status = option.status
        let translationKey = null
        if (status) {
          if (
            Object.prototype.hasOwnProperty.call(
              CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP,
              status
            )
          ) {
            translationKey =
              CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP[
                status as ClaimRequestStatus
              ]
          } else if (
            Object.prototype.hasOwnProperty.call(
              TICKET_STATUS_TRANSLATION_KEYS,
              status
            )
          ) {
            translationKey =
              TICKET_STATUS_TRANSLATION_KEYS[status as TicketStatus]
          }
        }

        return translationKey ? t(translationKey) : String(value)
      }

      return String(value)
    },
    [t, i18n.language]
  )

  return useCallback(
    (option: SupportFlowListItem) => {
      if (option.source === 'selectable-question') return []

      return SUPPORT_OPTION_FIELDS.reduce<SupportOptionDetail[]>(
        (details, field) => {
          const value = getOptionFieldValue(option, field)

          if (value) {
            details.push({
              field,
              title: t(`supportFlow.optionFields.${field}`),
              value,
            })
          }

          return details
        },
        []
      )
    },
    [getOptionFieldValue, t]
  )
}
