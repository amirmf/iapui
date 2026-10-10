import { AgreementSearchSelect } from '@features/claim-requests/pages/claim-request-management/components/agreement-search-select'
import { type ClaimRequestAssigneeFieldsForm } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import type { PartyRole } from '@iap/api-types'
import { TextareaField } from '@iap/forms'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { UserAccountSearchSelect } from '@modules/user-account-selection'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useFormContext } from 'react-hook-form'

interface ClaimRequestAssigneeFieldsProps {
  extPolicyId?: number | null
  disabled?: boolean
  enabled?: boolean
  idPrefix?: string
  branchLocationId?: string | null
  parentUserAccountId?: string | null
  assigneeRoles?: PartyRole
}

export function ClaimRequestAssigneeFields(
  props: ClaimRequestAssigneeFieldsProps
) {
  const {
    extPolicyId,
    disabled = false,
    enabled = true,
    idPrefix = 'claim-request-assignment',
    assigneeRoles,
    branchLocationId,
    parentUserAccountId,
  } = props
  const { t } = useTranslation()
  const { setValue, control } = useFormContext<ClaimRequestAssigneeFieldsForm>()
  const isPolicyDrivenAgreement = typeof extPolicyId === 'number'
  const agreementFieldId = `${idPrefix}-agreement`
  const assigneeFieldId = `${idPrefix}-assignee`

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {!isPolicyDrivenAgreement && (
          <FormField
            control={control}
            name='agreementId'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <FormLabel htmlFor={agreementFieldId}>
                  {t('agreements.title')}
                </FormLabel>
                <FormControl>
                  <AgreementSearchSelect
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value ?? '')
                      setValue('assigneeId', '')
                    }}
                    placeholder={t('agreements.select')}
                    disabled={disabled}
                    enabled={enabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name='assigneeId'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel htmlFor={assigneeFieldId}>
                {t('claimRequests.assignment.fieldLabel')}
              </FormLabel>
              <FormControl>
                <UserAccountSearchSelect
                  presentation='reference'
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? '')}
                  placeholder={t('claimRequests.assignment.placeholder')}
                  disabled={disabled}
                  roles={assigneeRoles}
                  branchLocationsId={branchLocationId}
                  parentUserAccountId={parentUserAccountId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <TextareaField
        control={control}
        name='description'
        label={t('claimRequests.assignment.descriptionLabel')}
        id={`${idPrefix}-description`}
        placeholder={t('claimRequests.assignment.descriptionPlaceholder')}
        disabled={disabled}
        rows={3}
      />
    </div>
  )
}
