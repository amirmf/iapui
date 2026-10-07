import {
  CLAIM_OBJECTION_REQUEST_STATUSES,
  CLAIM_OBJECTION_REQUEST_STATUS_TRANSLATION_KEYS,
} from '@features/claim-requests/constants/claim-request-status'
import type { ClaimRequestObjectionForm } from '@features/claim-requests/pages/claim-request-management/model/claim-request-objection-form-schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, Checkbox, cn } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import type { Control } from 'react-hook-form'

export function ClaimRequestObjectionStatusFields(props: {
  control: Control<ClaimRequestObjectionForm>
  isPending: boolean
  setReturnTemplatesOpen: (open: boolean) => void
}) {
  const { control, isPending, setReturnTemplatesOpen } = props
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='claimRequestStatus'
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2'>
              <FormLabel>
                {t('claimRequests.dialog.fields.objectionStatus')}
              </FormLabel>
              <FormControl>
                <div
                  aria-label={t('claimRequests.dialog.fields.status')}
                  className='flex flex-wrap gap-2'
                >
                  {CLAIM_OBJECTION_REQUEST_STATUSES.map((status) => {
                    const selected = field.value === status

                    return (
                      <Button
                        presentation='reference'
                        key={status}
                        type='button'
                        variant={selected ? 'secondary' : 'outline'}
                        size='sm'
                        onClick={() => {
                          field.onChange(status)
                          if (status !== 'APPROVED') {
                            setReturnTemplatesOpen(true)
                          }
                        }}
                        disabled={isPending}
                        className={cn(
                          'h-7 w-28 rounded-full text-xs font-semibold',
                          !selected &&
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {t(
                          CLAIM_OBJECTION_REQUEST_STATUS_TRANSLATION_KEYS[
                            status
                          ]
                        )}
                      </Button>
                    )
                  })}
                </div>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='isCheat'
        render={({ field: isCheatField }) => (
          <FormItem className='my-4 flex items-center gap-2'>
            <FormControl>
              <Checkbox
                checked={isCheatField.value === 'Y'}
                onCheckedChange={(checked) => {
                  isCheatField.onChange(checked ? 'Y' : 'N')
                }}
                disabled={isPending}
                aria-label={t('claimRequests.dialog.fields.isCheat')}
              />
            </FormControl>
            <FormLabel className='cursor-pointer font-medium text-destructive'>
              {t('claimRequests.dialog.fields.isCheat')}
            </FormLabel>
          </FormItem>
        )}
      />
    </>
  )
}
