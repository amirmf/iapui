import {
  type DmgCaseForm,
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

function DmgCaseFields1() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='insuredPersonId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.insuredPersonId')}
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
        name='serviceDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.serviceDate')}
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
        name='medicalSystemCode'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.medicalSystemCode')}
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
        name='illnessId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.illnessId')}
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
        name='serviceDetailId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.serviceDetailId')}
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
        name='serviceProvinceId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.serviceProvinceId')}
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

function DmgCaseFields2() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='tariffKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.tariffKindId')}
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
        name='doctorSpecialityId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.doctorSpecialityId'
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
        name='excessFranchiseAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.excessFranchiseAmount'
              )}
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
        name='deductionKindId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.deductionKindId')}
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
        name='firstInsurerShareAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.firstInsurerShareAmount'
              )}
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
        name='expertiseFranchisePercent'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.expertiseFranchisePercent'
              )}
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

function DmgCaseFields3() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='otherOrganizationsShareAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.otherOrganizationsShareAmount'
              )}
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
        name='toothId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.toothId')}
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
              {t('outpatientDocAcceptances.damageCaseFields.medicalCenterId')}
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
        name='drugCount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.drugCount')}
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
        name='deliveredDocTypeId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.deliveredDocTypeId'
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
        name='preAuthId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.preAuthId')}
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

function DmgCaseFields4() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='medicalBookLetSerialNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.medicalBookLetSerialNo'
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
        name='medicalBookletPageNo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.medicalBookletPageNo'
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
        name='cardSerial'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.cardSerial')}
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
        name='requestedAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.requestedAmount')}
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
        name='approvedAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.approvedAmount')}
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
        name='drugClaimId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.drugClaimId')}
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

function DmgCaseFields5() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='dataSenderId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.dataSenderId')}
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
        name='claimId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.claimId')}
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
        name='draftId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.draftId')}
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
        name='firstInsurerId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.firstInsurerId')}
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
        name='franchise'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.franchise')}
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
        name='exId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.exId')}
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

function DmgCaseFields6() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='totalAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.totalAmount')}
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
        name='deductionAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.deductionAmount')}
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
        name='discountAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.discountAmount')}
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
        name='excessOfTheInsurersCommitmentAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.excessOfTheInsurersCommitmentAmount'
              )}
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
        name='outOfTheInsurersCommitmentAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.outOfTheInsurersCommitmentAmount'
              )}
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
        name='thePatientLedFranchise'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.thePatientLedFranchise'
              )}
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

function DmgCaseFields7() {
  const { control } = useFormContext<DmgCaseForm>()
  const { t } = useTranslation()
  return (
    <>
      <FormField
        control={control}
        name='otherRecoverableAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.otherRecoverableAmount'
              )}
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
        name='deductionDesc'
        render={({ field }) => (
          <FormItem className='md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.deductionDesc')}
            </FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='nonPaymentReason'
        render={({ field }) => (
          <FormItem className='md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.nonPaymentReason')}
            </FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='isFranchiseDeduction'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t(
                'outpatientDocAcceptances.damageCaseFields.isFranchiseDeduction'
              )}
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
        name='insuredIsAdult'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.insuredIsAdult')}
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
        name='systemCalculated'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.systemCalculated')}
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
    </>
  )
}

function DmgCaseFields8() {
  const { control } = useFormContext<DmgCaseForm>()
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
        name='isCalculated'
        render={({ field }) => (
          <FormItem className='col-span-1 flex items-center justify-between rounded-md border p-3 md:col-span-2'>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.isCalculated')}
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
              {t('outpatientDocAcceptances.damageCaseFields.claimRequestId')}
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
        name='assessmentItemId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('outpatientDocAcceptances.damageCaseFields.assessmentItemId')}
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
              {t('outpatientDocAcceptances.damageCaseFields.status')}
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
              {t('outpatientDocAcceptances.damageCaseFields.wsStatus')}
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
              {t('outpatientDocAcceptances.damageCaseFields.wsResult')}
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

export function DmgCaseFields() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      <DmgCaseFields1 />
      <DmgCaseFields2 />
      <DmgCaseFields3 />
      <DmgCaseFields4 />
      <DmgCaseFields5 />
      <DmgCaseFields6 />
      <DmgCaseFields7 />
      <DmgCaseFields8 />
    </div>
  )
}
