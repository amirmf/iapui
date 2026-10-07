import { useEffect, useMemo, useState } from 'react'

import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/services/claim-request-management-service'
import { Button } from '@iap/ui'
import { SearchableSelect } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UpdateDocTypeFormProps {
  currentDocTypeId?: string | null
  onUpdated?: () => void
  onSuccess?: () => void
}

export function UpdateDocTypeForm(props: UpdateDocTypeFormProps) {
  const { currentDocTypeId, onUpdated, onSuccess } = props
  const { t } = useTranslation()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })

  const [selectedDocType, setSelectedDocType] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: docTypes, isFetching: isLoading } = useDocTypesData()

  useEffect(() => {
    setSelectedDocType(currentDocTypeId ?? undefined)
  }, [currentDocTypeId])

  const updateDocTypeMutation = useMutation({
    mutationFn: (newDocType: string) =>
      claimRequestService.updateDocType({ claimRequestId, newDocType }),
    onSuccess: () => {
      toast.success(t('claimRequests.messages.docTypeUpdated'))
      onUpdated?.()
      onSuccess?.()
    },
  })

  const isSubmitDisabled =
    !selectedDocType ||
    updateDocTypeMutation.isPending ||
    selectedDocType === (currentDocTypeId ?? undefined)

  const items = useMemo(() => {
    if (!docTypes) {
      return []
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()

    return docTypes
      .filter((docType) => docType.id)
      .filter((docType) => {
        if (!normalizedSearch) {
          return true
        }

        const searchableValues = [docType.docType].filter(Boolean) as string[]

        return searchableValues.some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        )
      })
      .map((docType) => ({
        label: [docType.docType].filter(Boolean).join(' '),
        value: docType.id ?? undefined,
      }))
      .filter((item) => item.value)
  }, [docTypes, searchTerm])

  return (
    <form
      className='max-w-[462px] space-y-4'
      onSubmit={(event) => {
        event.preventDefault()
        if (selectedDocType) {
          updateDocTypeMutation.mutate(selectedDocType)
        }
      }}
    >
      <SearchableSelect
        selectText={t('common.select')}
        loadingText={t('common.loading')}
        emptyText={t('common.noResults')}
        clearText={t('common.clear')}
        presentation='reference'
        value={selectedDocType}
        onChange={setSelectedDocType}
        items={items}
        placeholder={t('claimRequests.actions.selectDocType')}
        disabled={updateDocTypeMutation.isPending}
        isLoading={isLoading}
        onSearch={setSearchTerm}
      />

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitDisabled}>
          {updateDocTypeMutation.isPending
            ? t('common.loading')
            : t('claimRequests.actions.updateDocType')}
        </Button>
      </div>
    </form>
  )
}
