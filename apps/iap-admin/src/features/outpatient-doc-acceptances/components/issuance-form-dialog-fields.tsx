import {
  type IssuanceForm,
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

function IssuanceFields1() {
  const { control } = useFormContext<IssuanceForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='draftKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.draftKindId')}
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
        name='certificationExpertId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.issuanceFields.certificationExpertId'
              )}
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
        name='complementReasonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.complementReasonId')}
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
              {t('outpatientDocAcceptances.issuanceFields.dataSenderId')}
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
        name='exId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.exId')}
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
        name='amount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.amount')}
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
    </>
  )
}

function IssuanceFields2() {
  const { control } = useFormContext<IssuanceForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='claimId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.claimId')}
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
        name='docAcceptanceId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.docAcceptanceId')}
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
        name='draftNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.draftNo')}
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
        name='draftReasonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.draftReasonId')}
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
        name='reasonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.reasonId')}
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
        name='issuDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.issuDate')}
            </FormLabel>
            <FormControl>
              <Input type='date' {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function IssuanceFields3() {
  const { control } = useFormContext<IssuanceForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='sourceId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.sourceId')}
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
        name='exStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.exStatus')}
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
        name='calcTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.calcTime')}
            </FormLabel>
            <FormControl>
              <Input
                type='datetime-local'
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
        name='changeTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.changeTime')}
            </FormLabel>
            <FormControl>
              <Input
                type='datetime-local'
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
        name='paymentPreparationTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.issuanceFields.paymentPreparationTime'
              )}
            </FormLabel>
            <FormControl>
              <Input
                type='datetime-local'
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
        name='calcJobStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.calcJobStatus')}
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

function IssuanceFields4() {
  const { control } = useFormContext<IssuanceForm>()
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
        name='autoCalc'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.autoCalc')}
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
        name='isComfort'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.isComfort')}
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
        name='claimRequestId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.claimRequestId')}
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
        name='status'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.status')}
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
        name='wsStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.wsStatus')}
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
        name='description'
        render={({ field }) => (
          <FormItem className='md:col-span-2 xl:col-span-3'>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.description')}
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

function IssuanceFields5() {
  const { control } = useFormContext<IssuanceForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='wsResult'
        render={({ field }) => (
          <FormItem className='md:col-span-2 xl:col-span-3'>
            <FormLabel>
              {t('outpatientDocAcceptances.issuanceFields.wsResult')}
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

export function IssuanceFields() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      <IssuanceFields1 />
      <IssuanceFields2 />
      <IssuanceFields3 />
      <IssuanceFields4 />
      <IssuanceFields5 />
    </div>
  )
}
