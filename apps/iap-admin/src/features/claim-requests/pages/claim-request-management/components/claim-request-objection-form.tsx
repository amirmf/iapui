import { useCallback, useMemo, useRef, useState } from 'react'

import { useAssessmentItemsData } from '@features/assessment-items'
import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import { ClaimRequestObjectionStatusFields } from '@features/claim-requests/pages/claim-request-management/components/claim-request-objection-status-fields'
import { ClaimRequestReturnTemplatesDialog } from '@features/claim-requests/pages/claim-request-management/components/claim-request-return-templates-dialog'
import {
  type ClaimRequestObjectionForm,
  claimRequestObjectionFormSchema,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-objection-form-schema'
import { hasDuplicatedAssessmentItem } from '@features/claim-requests/pages/claim-request-management/model/objection-approval-guards'
import { claimRequestManagementService } from '@features/claim-requests/services/claim-request-management-service'
import { RepetitiveResponseTextarea } from '@features/repetitive-responses'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ClaimRequest, type ClaimRequestStatus } from '@iap/api-types'
import { ConfirmDialog } from '@iap/dialogs'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@iap/forms'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { type QueryObserverResult, useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ClaimRequestObjectionFormProps<TData> {
  claimRequestId?: string
  claimRequest?: ClaimRequest
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function ClaimRequestObjectionForm<TData>(
  props: ClaimRequestObjectionFormProps<TData>
) {
  const { claimRequestId, claimRequest, refetch } = props
  const { t } = useTranslation()
  const isNext = useRef<boolean>(false)
  const navigate = useNavigate()
  const ids = useClaimRequestIds((state) => state.ids)
  const setIds = useClaimRequestIds((state) => state.setIds)
  const { data: assessmentItemsData } = useAssessmentItemsData(claimRequestId)
  const [isOpenOverAmount, setIsOpenOverAmount] = useState(false)
  const [isOpenDuplicates, setIsOpenDuplicates] = useState(false)
  const [isOpenDuplicateAssessmentItems, setIsOpenDuplicateAssessmentItems] =
    useState(false)
  const [isReturnTemplatesOpen, setReturnTemplatesOpen] = useState(false)

  const assessmentTotalPrice = useMemo(() => {
    return assessmentItemsData?.reduce((acc, cur) => {
      if (cur.status === 'APPROVED') {
        return acc + (cur.amount || 0)
      }
      return 0
    }, 0)
  }, [assessmentItemsData])

  const methods = useForm<ClaimRequestObjectionForm>({
    resolver: zodResolver(
      useMemo(() => claimRequestObjectionFormSchema(t), [t])
    ),
    defaultValues: {
      description: '',
      claimRequestStatus: undefined,
      isCheat: 'N',
    },
  })
  const { handleSubmit, control, reset, getValues, setValue } = methods

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      description,
      claimRequestStatus,
      isCheat,
    }: {
      description?: string | null
      claimRequestStatus: ClaimRequestStatus
      isCheat?: 'Y' | 'N'
    }) =>
      claimRequestManagementService.submitObjection({
        claimRequestId: claimRequestId || '',
        description: description || 'تایید شده',
        claimRequestStatus,
        isCheat: isCheat ?? 'N',
      }),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.objectionSubmitSuccess'))
      reset()
      setIsOpenOverAmount(false)
      setIsOpenDuplicates(false)
      setIsOpenDuplicateAssessmentItems(false)
      if (isNext.current && ids.length) {
        const nextId = ids[0]
        setIds(ids.slice(1))
        navigate({
          to: `/claim-requests/${nextId}/claim-request-management`,
          replace: true,
        })
      } else {
        await refetch()
      }
    },
  })

  const onSubmit = useCallback(
    (values: ClaimRequestObjectionForm) => {
      // duplicate assessmentItem
      if (
        values.claimRequestStatus === 'APPROVED' &&
        hasDuplicatedAssessmentItem(assessmentItemsData ?? [])
      ) {
        setIsOpenDuplicateAssessmentItems(true)
        return
      }

      // overAmount
      if (
        values.claimRequestStatus === 'APPROVED' &&
        assessmentTotalPrice &&
        claimRequest?.amount &&
        assessmentTotalPrice > claimRequest?.amount
      ) {
        setIsOpenOverAmount(true)
        return
      }

      // duplicate claim-request
      if (
        values.claimRequestStatus === 'APPROVED' &&
        claimRequest?.duplicates?.length
      ) {
        setIsOpenDuplicates(true)
        return
      }

      mutate(values)
    },
    [
      assessmentTotalPrice,
      assessmentItemsData,
      claimRequest?.amount,
      claimRequest?.duplicates,
      mutate,
    ]
  )

  const handleConfirmDuplicateClaim = useCallback(() => {
    const values = getValues()
    mutate(values)
  }, [getValues, mutate])

  const handleConfirmOverAmount = useCallback(() => {
    setIsOpenOverAmount(false)
  }, [])

  const handleConfirmDuplicateAssessmentItem = useCallback(() => {
    setIsOpenDuplicateAssessmentItems(false)
  }, [])

  return (
    <>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Separator className='mb-5' />
          <ClaimRequestObjectionStatusFields
            control={control}
            isPending={isPending}
            setReturnTemplatesOpen={setReturnTemplatesOpen}
          />
          <div className='mt-3 flex gap-2'>
            <FormField
              control={control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <RepetitiveResponseTextarea
                      textareaRef={field.ref}
                      name={field.name}
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      aria-label={t(
                        'claimRequests.dialog.fields.newObjectionDescription'
                      )}
                      placeholder={t(
                        'claimRequests.dialog.fields.newObjectionDescription'
                      )}
                      isBusy={isPending}
                      disabled={isPending}
                      className={cn('h-16', ids.length && 'h-20')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                presentation='reference'
                type='submit'
                className={cn(
                  'flex flex-1 items-center',
                  !ids.length && 'min-h-16',
                  !!ids.length && 'w-full'
                )}
                size='sm'
                variant='secondary'
                disabled={isPending}
                onClick={() => {
                  isNext.current = false
                }}
              >
                <span>{t('claimRequests.dialog.fields.sendReply')}</span>
                <Send />
              </Button>
              {ids.length ? (
                <Button
                  presentation='reference'
                  type='submit'
                  className='mt-4 flex flex-1 items-center'
                  size='sm'
                  disabled={isPending}
                  onClick={() => {
                    isNext.current = true
                  }}
                >
                  <span>{t('claimRequests.dialog.fields.sendReplyNext')}</span>
                  <Send />
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </Form>
      <ConfirmDialog
        presentation='reference'
        open={isOpenOverAmount}
        onOpenChange={setIsOpenOverAmount}
        isLoading={isPending}
        title={t('claimRequests.confirmations.objectionPayment.title')}
        description={t(
          'claimRequests.confirmations.objectionPayment.description'
        )}
        onConfirm={handleConfirmOverAmount}
        hideCancelButton
        confirmLabel={t('common.dialog.understood')}
      />
      <ConfirmDialog
        presentation='reference'
        open={isOpenDuplicates}
        onOpenChange={setIsOpenDuplicates}
        confirmVariant='destructive'
        isLoading={isPending}
        title={t('claimRequests.confirmations.duplicates.title')}
        description={t('claimRequests.confirmations.duplicates.description')}
        onConfirm={handleConfirmDuplicateClaim}
      />
      <ConfirmDialog
        presentation='reference'
        open={isOpenDuplicateAssessmentItems}
        onOpenChange={setIsOpenDuplicateAssessmentItems}
        confirmVariant='destructive'
        hideCancelButton
        isLoading={isPending}
        title={t('claimRequests.confirmations.duplicateAssessmentItems.title')}
        description={t(
          'claimRequests.confirmations.duplicateAssessmentItems.description'
        )}
        onConfirm={handleConfirmDuplicateAssessmentItem}
      />
      <ClaimRequestReturnTemplatesDialog
        open={isReturnTemplatesOpen}
        onOpenChange={setReturnTemplatesOpen}
        onSelectResponse={(description) => {
          setValue('description', description)
        }}
      />
    </>
  )
}
