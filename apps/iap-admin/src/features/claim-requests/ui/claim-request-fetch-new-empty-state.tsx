import { useState } from 'react'

import { Button, Input } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { claimRequestService } from '../services/claim-request-service'

export function ClaimRequestFetchNewEmptyState(props: { onFetch: () => void }) {
  const { onFetch } = props
  const { t } = useTranslation()
  const [extContractId, setExtContractId] = useState('')
  const [extPolicyId, setExtPolicyId] = useState('')
  const mutation = useMutation({
    mutationFn: () =>
      claimRequestService.assignNewToMe({
        extContractId: extContractId.trim() || undefined,
        extPolicyId: extPolicyId.trim() || undefined,
      }),
    onSuccess: onFetch,
  })

  return (
    <div className='flex flex-col items-center gap-3 py-12'>
      <Input
        inputMode='numeric'
        onChange={(event) => setExtContractId(event.target.value)}
        placeholder={t('claimRequests.filters.extContractId')}
        value={extContractId}
      />
      <Input
        inputMode='numeric'
        onChange={(event) => setExtPolicyId(event.target.value)}
        placeholder={t('claimRequests.filters.extPolicyId')}
        value={extPolicyId}
      />
      <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending
          ? t('common.loading')
          : t('claimRequests.fetchNewRequests')}
      </Button>
    </div>
  )
}
