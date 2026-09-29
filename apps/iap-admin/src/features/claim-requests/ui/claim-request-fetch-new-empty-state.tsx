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
    <div className='flex flex-col items-center justify-center gap-4 py-12'>
      <Input
        className='max-w-52'
        onChange={(event) => setExtContractId(event.target.value)}
        numerical
        placeholder={t('claimRequests.extContractIdPlaceholder')}
        value={extContractId}
      />
      <Input
        className='max-w-52'
        onChange={(event) => setExtPolicyId(event.target.value)}
        numerical
        placeholder={t('claimRequests.extPolicyIdPlaceholder')}
        value={extPolicyId}
      />
      <Button
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        size='sm'
      >
        {mutation.isPending ? (
          <>
            <span
              aria-hidden='true'
              className='mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent'
            />
            {t('common.loading')}
          </>
        ) : (
          t('claimRequests.fetchNewRequests')
        )}
      </Button>
    </div>
  )
}
