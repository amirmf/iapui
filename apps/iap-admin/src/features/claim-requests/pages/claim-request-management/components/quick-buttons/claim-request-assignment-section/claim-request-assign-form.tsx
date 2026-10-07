import { useEffect, useMemo } from 'react'

import {
  type ClaimRequestAssigneeFieldsForm,
  claimRequestAssigneeFieldsFormSchema,
} from '@features/claim-requests/model/claim-request-management-forms'
import { ClaimRequestAssigneeFields } from '@features/claim-requests/pages/claim-request-management/components/claim-request-assignee-fields'
import { type ClaimRequestAssignTarget } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-assignment-section/claim-request-assign-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@iap/forms'
import { Button } from '@iap/ui'
import { DialogFooter } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useForm, useWatch } from 'react-hook-form'

interface ClaimRequestAssignFormProps {
  open: boolean
  extPolicyId?: number | null
  branchLocationId?: string | null
  parentUserAccountId?: string | null
  assignedId?: string | null
  defaultTarget?: ClaimRequestAssignTarget
  isPending: boolean
  onCancel: () => void
  onSubmit: (values: ClaimRequestAssigneeFieldsForm) => void
}

export function ClaimRequestAssignForm(props: ClaimRequestAssignFormProps) {
  const {
    open,
    extPolicyId,
    assignedId,
    defaultTarget = 'user',
    isPending,
    onCancel,
    onSubmit,
    branchLocationId,
    parentUserAccountId,
  } = props
  const { t } = useTranslation()
  const schema = useMemo(() => claimRequestAssigneeFieldsFormSchema(t), [t])
  // const [selectedTarget, setSelectedTarget] =
  //   useState<ClaimRequestAssignTarget>(defaultTarget)

  const methods = useForm<ClaimRequestAssigneeFieldsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreementId: '',
      assigneeId: '',
      description: '',
    },
  })

  const { handleSubmit, control, reset } = methods

  useEffect(() => {
    if (!open) {
      reset()
      return
    }

    // setSelectedTarget(defaultTarget)
  }, [open, defaultTarget, reset])

  const selectedAssigneeId = useWatch({
    control,
    name: 'assigneeId',
  })

  const disableForm = isPending || !open || selectedAssigneeId === assignedId
  // const idPrefix =
  //   selectedTarget === 'doctor' ? 'doctor-assign' : 'single-assign'

  return (
    <>
      <Form {...methods}>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <ClaimRequestAssigneeFields
            extPolicyId={extPolicyId}
            disabled={isPending}
            enabled={open}
            idPrefix={'doctor-assign'}
            assigneeRoles='ROLE_DOCTOR_USER'
            branchLocationId={branchLocationId}
            parentUserAccountId={parentUserAccountId}
          />
          <DialogFooter className='gap-2 sm:space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isPending}
            >
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type='submit' disabled={disableForm}>
              {isPending
                ? t('claimRequests.assignment.submitting')
                : t('claimRequests.assignment.assignButtonDialog')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
