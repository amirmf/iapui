import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { SupportFeatureButton } from '@iap/support'
import useGetMyInsurancePolicy from '@features/my-claims/queries/use-get-my-insurance-policy'
import type { MyClaimRequestForm } from '@features/my-claims/model/my-claim-request-form-schema'
export function MyClaimMyInsurancePolicyFormField({ featureKey }: { featureKey?: string }) {
 const { t }=useTranslation(); const { control,setValue }=useFormContext<MyClaimRequestForm>(); const q=useGetMyInsurancePolicy(); const items=useMemo(()=> (q.data??[]).map(p=>({label:p.title??'',value:String(p.id)})),[q.data]); const selected=useWatch({control,name:'extPolicyId'})
 useEffect(()=>{if(!q.isLoading&&!selected&&items.length)setValue('extPolicyId',Number(items[0].value))},[q.isLoading,selected,items,setValue])
 return <FormField control={control} name='extPolicyId' render={({field})=><FormItem><FormLabel>{t('claimRequests.dialog.fields.insurancePolicy')} *{featureKey && <SupportFeatureButton featureKey={featureKey} variant='secondary' size='xs' />}</FormLabel><FormControl><SearchableSelect presentation='reference' items={items} value={field.value?String(field.value):undefined} onChange={v=>{setValue('extNationalCode',{id:0,nationalCode:'',fullName:''});field.onChange(v?Number(v):undefined)}} placeholder={t('claimRequests.dialog.fields.selectInsurancePolicy')} isLoading={q.isLoading} canClear={false}/></FormControl><FormMessage/></FormItem>}/>
}
