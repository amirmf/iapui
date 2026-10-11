import { useDeferredValue, useMemo, useRef, useState } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { AgentClaimRequestFormValues } from '../model/agent-claim-request-form-schema'

export function AgentClaimRequestFormDocTypes() {
  const { control } = useFormContext<AgentClaimRequestFormValues>()
  const { t } = useTranslation()
  const { data: docTypes, isLoading: isLoadingDocTypes } = useDocTypesData()
  const [search, setSearch] = useState('')
  const others = useRef<{ value: string; label: string } | null>(null)
  const deferredValue = useDeferredValue(search)

  const docTypeItems = useMemo(() => {
    return (docTypes ?? [])
      .map((docType) => {
        if (docType.docTypeCode === 'others') {
          others.current = {
            label: docType.docType ?? '',
            value: docType.id ?? '',
          }
          return null
        }
        return {
          label: docType.docType ?? '',
          value: docType.id ?? '',
        }
      })
      .filter((item): item is { label: string; value: string } =>
        Boolean(item?.value)
      )
  }, [docTypes])

  const filteredDocTypeItems = useMemo(() => {
    if (deferredValue === '') {
      return docTypeItems
    }

    return docTypeItems.filter(
      (item) =>
        item.label.toLowerCase().search(deferredValue.toLowerCase()) !== -1
    )
  }, [deferredValue, docTypeItems])

  return (
    <FormField
      control={control}
      name='docType'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('claimRequests.dialog.fields.docType')}
            <span className='text-destructive'>*</span>
          </FormLabel>
          <FormControl>
            <SearchableSelect
              value={field.value?.id || undefined}
              onSearch={setSearch}
              onChange={(value) => {
                const selectedDocType = docTypes?.find(
                  (docType) => docType.id === value
                )
                field.onChange(
                  selectedDocType ?? {
                    id: value ?? '',
                    docType: '',
                    docTypeCode: '',
                    documentGuide: '',
                  }
                )
              }}
              items={
                others.current
                  ? filteredDocTypeItems.concat(others.current)
                  : filteredDocTypeItems
              }
              placeholder={t('claimRequests.dialog.fields.selectDocType')}
              isLoading={isLoadingDocTypes}
              shouldFilter={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentClaimRequestFormDocTypes
