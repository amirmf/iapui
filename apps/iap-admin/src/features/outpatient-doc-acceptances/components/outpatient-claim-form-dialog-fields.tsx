import {
  type OutpatientClaimForm,
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
import { Checkbox, Input, SingleSelect, Textarea } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

function OutpatientClaimFields1() {
  const { control } = useFormContext<OutpatientClaimForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='acceptanceId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.acceptanceId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='announcementDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.announcementDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='chargePlanId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.chargePlanId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='claimExpertId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.claimExpertId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='dataSenderId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.dataSenderId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='dmgRegisterarId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.dmgRegisterarId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function OutpatientClaimFields2() {
  const { control } = useFormContext<OutpatientClaimForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='docDelivererAgentId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.docDelivererAgentId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='docDeliveryKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.docDeliveryKindId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='draftExpertId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.draftExpertId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='estimateAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.estimateAmount')}
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
        control={control}
        name='expertiseEndDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.expertiseEndDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='claimNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.claimNo')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function OutpatientClaimFields3() {
  const { control } = useFormContext<OutpatientClaimForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='exId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.exId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='insuredPersonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.insuredPersonId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='medicalCenterId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.medicalCenterId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='policyId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.policyId')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='letterNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.letterNo')}
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='description'
        render={({ field }) => (
          <FormItem className='md:col-span-2 xl:col-span-3'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.description')}
            </FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function OutpatientClaimFields4() {
  const { control } = useFormContext<OutpatientClaimForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='hasPreAuth'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.hasPreAuth')}
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='hasReturnDocs'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.hasReturnDocs')}
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='isMatchedWithList'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.isMatchedWithList')}
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='isPaymentFromCash'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.isPaymentFromCash')}
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='statusChangeDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.statusChangeDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='exStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.exStatus')}
            </FormLabel>
            <FormControl>
              <Input type='number' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function OutpatientClaimFields5() {
  const { control } = useFormContext<OutpatientClaimForm>()
  const { t } = useTranslation()
  const statusOptions = outpatientDocAcceptanceStatusEnum.options.map(
    (value) => ({ value, label: t(`outpatientDocAcceptances.status.${value}`) })
  )
  const wsStatusOptions = outpatientDocAcceptanceWsStatusEnum.options.map(
    (value) => ({
      value,
      label: t(`outpatientDocAcceptances.wsStatus.${value}`),
    })
  )
  return (
    <>
      <FormField
        control={control}
        name='status'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.status')}
            </FormLabel>
            <SingleSelect
              selectText={t('common.select')}
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
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
        control={control}
        name='claimRequestId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.claimRequestId')}
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='wsStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.wsStatus')}
            </FormLabel>
            <SingleSelect
              selectText={t('common.select')}
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
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
        control={control}
        name='wsResult'
        render={({ field }) => (
          <FormItem className='md:col-span-2 xl:col-span-3'>
            <FormLabel>
              {t('outpatientDocAcceptances.claimFields.wsResult')}
            </FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export function OutpatientClaimFields() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      <OutpatientClaimFields1 />
      <OutpatientClaimFields2 />
      <OutpatientClaimFields3 />
      <OutpatientClaimFields4 />
      <OutpatientClaimFields5 />
    </div>
  )
}
