import {
  type OutpatientDocAcceptanceForm,
  outpatientDocAcceptanceStatusEnum,
  outpatientDocAcceptanceWsStatusEnum,
} from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Input, SingleSelect, Textarea } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function OutpatientDocAcceptanceFormFields() {
  const form = useFormContext<OutpatientDocAcceptanceForm>()
  const { t: translate } = useTranslation()
  const t = translate as (key: string) => string
  const statusOptions = outpatientDocAcceptanceStatusEnum.options.map(
    (value) => ({
      value,
      label: t(`outpatientDocAcceptances.status.${value}`),
    })
  )

  const wsStatusOptions = outpatientDocAcceptanceWsStatusEnum.options.map(
    (value) => ({
      value,
      label: t(`outpatientDocAcceptances.wsStatus.${value}`),
    })
  )

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      <FormField
        control={form.control}
        name='exId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.exId')}</FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='docDeliveryKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.docDeliveryKindId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='deliveryDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.deliveryDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='acceptanceKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.acceptanceKindId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='claimCount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.claimCount')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='dichargeMonth'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.dichargeMonth')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='totalAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.totalAmount')}
            </FormLabel>
            <FormControl>
              <Input
                type='number'
                step='0.01'
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='policyId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.policyId')}</FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='insuredPersonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.insuredPersonId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='medicalCenterId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.medicalCenterId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='letterDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.letterDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='letterNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.letterNo')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='secretariatNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.secretariatNo')}
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='secretariatDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.secretariatDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='paymentDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.paymentDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='docDelivererAgentId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.docDelivererAgentId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='dataSenderId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.dataSenderId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='claimExpertId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.claimExpertId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='opUnitId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.opUnitId')}</FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='exStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.exStatus')}</FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='status'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.status')}</FormLabel>
            <SingleSelect
              items={statusOptions}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value || undefined)}
              placeholder={t('outpatientDocAcceptances.form.statusPlaceholder')}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='wsStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('outpatientDocAcceptances.form.wsStatus')}</FormLabel>
            <SingleSelect
              items={wsStatusOptions}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value || undefined)}
              placeholder={t(
                'outpatientDocAcceptances.form.wsStatusPlaceholder'
              )}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='claimRequestId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.form.claimRequestId')}
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='wsResult'
        render={({ field }) => (
          <FormItem className='md:col-span-2 xl:col-span-3'>
            <FormLabel>{t('outpatientDocAcceptances.form.wsResult')}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
