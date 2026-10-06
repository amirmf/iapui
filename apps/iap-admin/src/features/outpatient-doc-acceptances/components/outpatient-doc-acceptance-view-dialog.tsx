import { useMemo } from 'react'

import {
  OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS,
  OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS,
  outpatientDocAcceptanceStatusColors,
  outpatientDocAcceptanceWsStatusColors,
} from '@features/outpatient-doc-acceptances/constants/outpatient-doc-acceptance-status'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { formatDateTime } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import { Card, CardContent } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@iap/ui'
import { ReadonlyItems } from '@shared/components/readonly-items'
import { useTranslation } from 'react-i18next'

const getStatusTranslationKey = (status: string | null | undefined) => {
  if (!status) return undefined
  return OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS[
    status as keyof typeof OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS
  ]
}

const getWsStatusTranslationKey = (wsStatus: string | null | undefined) => {
  if (!wsStatus) return undefined
  return OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS[
    wsStatus as keyof typeof OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS
  ]
}

const getStatusColorClass = (status: string | null | undefined) => {
  if (!status) return ''
  return (
    outpatientDocAcceptanceStatusColors[
      status as keyof typeof outpatientDocAcceptanceStatusColors
    ] || ''
  )
}

const getWsStatusColorClass = (wsStatus: string | null | undefined) => {
  if (!wsStatus) return ''
  return (
    outpatientDocAcceptanceWsStatusColors[
      wsStatus as keyof typeof outpatientDocAcceptanceWsStatusColors
    ] || ''
  )
}

export function OutpatientDocAcceptanceViewDialog() {
  const { t: translate, i18n } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const { open, currentRow, openDialog, closeDialog } =
    useOutpatientDocAcceptance()
  const docAcceptance = currentRow
  const isModalOpen = open === 'view'
  const formatBoolean = (value?: boolean | null) => {
    if (value === undefined || value === null) {
      return '-'
    }
    return value ? t('common.yes') : t('common.no')
  }

  const overviewItems = useMemo(() => {
    if (!docAcceptance) {
      return []
    }
    const statusTranslationKey = getStatusTranslationKey(docAcceptance.status)
    const wsStatusTranslationKey = getWsStatusTranslationKey(
      docAcceptance.wsStatus
    )
    const statusColorClass = getStatusColorClass(docAcceptance.status)
    const wsStatusColorClass = getWsStatusColorClass(docAcceptance.wsStatus)

    return [
      { label: t('outpatientDocAcceptances.form.id'), value: docAcceptance.id },
      {
        label: t('outpatientDocAcceptances.form.exId'),
        value: docAcceptance.exId,
      },
      {
        label: t('outpatientDocAcceptances.form.docDeliveryKindId'),
        value: docAcceptance.docDeliveryKindId,
      },
      {
        label: t('outpatientDocAcceptances.form.deliveryDate'),
        value: docAcceptance.deliveryDate,
      },
      {
        label: t('outpatientDocAcceptances.form.acceptanceKindId'),
        value: docAcceptance.acceptanceKindId,
      },
      {
        label: t('outpatientDocAcceptances.form.claimCount'),
        value: docAcceptance.claimCount,
      },
      {
        label: t('outpatientDocAcceptances.form.dichargeMonth'),
        value: docAcceptance.dichargeMonth,
      },
      {
        label: t('outpatientDocAcceptances.form.totalAmount'),
        value: docAcceptance.totalAmount,
      },
      {
        label: t('outpatientDocAcceptances.form.policyId'),
        value: docAcceptance.policyId,
      },
      {
        label: t('outpatientDocAcceptances.form.insuredPersonId'),
        value: docAcceptance.insuredPersonId,
      },
      {
        label: t('outpatientDocAcceptances.form.medicalCenterId'),
        value: docAcceptance.medicalCenterId,
      },
      {
        label: t('outpatientDocAcceptances.form.letterDate'),
        value: docAcceptance.letterDate,
      },
      {
        label: t('outpatientDocAcceptances.form.letterNo'),
        value: docAcceptance.letterNo,
      },
      {
        label: t('outpatientDocAcceptances.form.secretariatNo'),
        value: docAcceptance.secretariatNo,
      },
      {
        label: t('outpatientDocAcceptances.form.secretariatDate'),
        value: docAcceptance.secretariatDate,
      },
      {
        label: t('outpatientDocAcceptances.form.paymentDate'),
        value: docAcceptance.paymentDate,
      },
      {
        label: t('outpatientDocAcceptances.form.docDelivererAgentId'),
        value: docAcceptance.docDelivererAgentId,
      },
      {
        label: t('outpatientDocAcceptances.form.dataSenderId'),
        value: docAcceptance.dataSenderId,
      },
      {
        label: t('outpatientDocAcceptances.form.claimExpertId'),
        value: docAcceptance.claimExpertId,
      },
      {
        label: t('outpatientDocAcceptances.form.opUnitId'),
        value: docAcceptance.opUnitId,
      },
      {
        label: t('outpatientDocAcceptances.form.exStatus'),
        value: docAcceptance.exStatus,
      },
      {
        label: t('outpatientDocAcceptances.form.status'),
        value: statusTranslationKey ? (
          <Badge className={statusColorClass}>{t(statusTranslationKey)}</Badge>
        ) : (
          docAcceptance.status
        ),
      },
      {
        label: t('outpatientDocAcceptances.form.claimRequestId'),
        value: docAcceptance.claimRequestId,
      },
      {
        label: t('outpatientDocAcceptances.form.wsStatus'),
        value: wsStatusTranslationKey ? (
          <Badge className={wsStatusColorClass}>
            {t(wsStatusTranslationKey)}
          </Badge>
        ) : (
          docAcceptance.wsStatus
        ),
      },
      {
        label: t('outpatientDocAcceptances.form.wsResult'),
        value: docAcceptance.wsResult,
      },
      {
        label: t('outpatientDocAcceptances.columns.createdAt'),
        value: formatDateTime(docAcceptance.createdAt),
      },
      {
        label: t('outpatientDocAcceptances.columns.updatedAt'),
        value: formatDateTime(docAcceptance.updatedAt),
      },
    ]
  }, [docAcceptance, t])

  if (!docAcceptance) {
    return null
  }

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeDialog()
    }
  }

  const outpatientClaim = docAcceptance.outpatientClaim
  const issuance = outpatientClaim?.issuance ?? undefined
  const damageCases = issuance?.dmgCases ?? []

  const handleOpen = (
    action:
      | 'manageClaim'
      | 'viewClaim'
      | 'manageIssuance'
      | 'viewIssuance'
      | 'manageDmgCases'
  ) => {
    openDialog(action, docAcceptance)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        presentation='reference'
        className='max-h-[90vh] overflow-y-auto sm:max-w-5xl'
      >
        <DialogHeader>
          <DialogTitle>
            {t('outpatientDocAcceptances.dialog.details')}
          </DialogTitle>
        </DialogHeader>

        <Tabs dir={i18n.dir()} defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-1 gap-2 sm:grid-cols-4'>
            <TabsTrigger value='overview'>
              {t('outpatientDocAcceptances.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value='claim'>
              {t('outpatientDocAcceptances.tabs.claim')}
            </TabsTrigger>
            <TabsTrigger value='issuance'>
              {t('outpatientDocAcceptances.tabs.issuance')}
            </TabsTrigger>
            <TabsTrigger value='damageCases'>
              {t('outpatientDocAcceptances.tabs.damageCases')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-4'>
            <Card>
              <CardContent className='grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3'>
                {overviewItems.map((item) => (
                  <ReadonlyItems
                    key={item.label}
                    title={item.label}
                    value={item.value ?? '-'}
                    className='flex flex-wrap items-center'
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='claim' className='mt-4 space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h3 className='text-lg font-semibold'>
                {t('outpatientDocAcceptances.sections.claimTitle')}
              </h3>
              <div className='flex flex-wrap gap-2'>
                {outpatientClaim ? (
                  <>
                    <Button
                      variant='outline'
                      onClick={() => handleOpen('viewClaim')}
                    >
                      {t('outpatientDocAcceptances.actions.viewClaim')}
                    </Button>
                    <Button onClick={() => handleOpen('manageClaim')}>
                      {t('outpatientDocAcceptances.actions.editClaim')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleOpen('manageClaim')}>
                    {t('outpatientDocAcceptances.actions.createClaim')}
                  </Button>
                )}
              </div>
            </div>

            {outpatientClaim ? (
              <Card>
                <CardContent className='grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3'>
                  {[
                    {
                      label: t('outpatientDocAcceptances.claimFields.id'),
                      value: outpatientClaim.id,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.acceptanceId'
                      ),
                      value: outpatientClaim.acceptanceId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.announcementDate'
                      ),
                      value: outpatientClaim.announcementDate,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.chargePlanId'
                      ),
                      value: outpatientClaim.chargePlanId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.claimExpertId'
                      ),
                      value: outpatientClaim.claimExpertId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.dataSenderId'
                      ),
                      value: outpatientClaim.dataSenderId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.description'
                      ),
                      value: outpatientClaim.description,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.dmgRegisterarId'
                      ),
                      value: outpatientClaim.dmgRegisterarId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.docDelivererAgentId'
                      ),
                      value: outpatientClaim.docDelivererAgentId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.docDeliveryKindId'
                      ),
                      value: outpatientClaim.docDeliveryKindId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.draftExpertId'
                      ),
                      value: outpatientClaim.draftExpertId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.estimateAmount'
                      ),
                      value: outpatientClaim.estimateAmount,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.expertiseEndDate'
                      ),
                      value: outpatientClaim.expertiseEndDate,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.hasPreAuth'
                      ),
                      value: formatBoolean(outpatientClaim.hasPreAuth),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.hasReturnDocs'
                      ),
                      value: formatBoolean(outpatientClaim.hasReturnDocs),
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.exId'),
                      value: outpatientClaim.exId,
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.claimNo'),
                      value: outpatientClaim.claimNo,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.insuredPersonId'
                      ),
                      value: outpatientClaim.insuredPersonId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.isMatchedWithList'
                      ),
                      value: formatBoolean(outpatientClaim.isMatchedWithList),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.isPaymentFromCash'
                      ),
                      value: formatBoolean(outpatientClaim.isPaymentFromCash),
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.letterNo'),
                      value: outpatientClaim.letterNo,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.medicalCenterId'
                      ),
                      value: outpatientClaim.medicalCenterId,
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.policyId'),
                      value: outpatientClaim.policyId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.statusChangeDate'
                      ),
                      value: outpatientClaim.statusChangeDate,
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.exStatus'),
                      value: outpatientClaim.exStatus,
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.status'),
                      value: getStatusTranslationKey(outpatientClaim.status) ? (
                        <Badge
                          className={getStatusColorClass(
                            outpatientClaim.status
                          )}
                        >
                          {t(
                            getStatusTranslationKey(
                              outpatientClaim.status
                            ) as string
                          )}
                        </Badge>
                      ) : (
                        outpatientClaim.status
                      ),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.claimFields.claimRequestId'
                      ),
                      value: outpatientClaim.claimRequestId,
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.wsStatus'),
                      value: getWsStatusTranslationKey(
                        outpatientClaim.wsStatus
                      ) ? (
                        <Badge
                          className={getWsStatusColorClass(
                            outpatientClaim.wsStatus
                          )}
                        >
                          {t(
                            getWsStatusTranslationKey(
                              outpatientClaim.wsStatus
                            ) as string
                          )}
                        </Badge>
                      ) : (
                        outpatientClaim.wsStatus
                      ),
                    },
                    {
                      label: t('outpatientDocAcceptances.claimFields.wsResult'),
                      value: outpatientClaim.wsResult,
                    },
                  ].map((item) => (
                    <ReadonlyItems
                      key={item.label}
                      title={item.label}
                      value={item.value ?? '-'}
                      className='flex flex-wrap items-center'
                    />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className='p-6 text-center text-sm text-muted-foreground'>
                  {t('outpatientDocAcceptances.messages.noClaim')}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='issuance' className='mt-4 space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h3 className='text-lg font-semibold'>
                {t('outpatientDocAcceptances.sections.issuanceTitle')}
              </h3>
              <div className='flex flex-wrap gap-2'>
                {issuance ? (
                  <>
                    <Button
                      variant='outline'
                      onClick={() => handleOpen('viewIssuance')}
                    >
                      {t('outpatientDocAcceptances.actions.viewIssuance')}
                    </Button>
                    <Button onClick={() => handleOpen('manageIssuance')}>
                      {t('outpatientDocAcceptances.actions.editIssuance')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleOpen('manageIssuance')}>
                    {t('outpatientDocAcceptances.actions.createIssuance')}
                  </Button>
                )}
              </div>
            </div>

            {issuance ? (
              <Card>
                <CardContent className='grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3'>
                  {[
                    {
                      label: t('outpatientDocAcceptances.issuanceFields.id'),
                      value: issuance.id,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.draftKindId'
                      ),
                      value: issuance.draftKindId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.description'
                      ),
                      value: issuance.description,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.certificationExpertId'
                      ),
                      value: issuance.certificationExpertId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.complementReasonId'
                      ),
                      value: issuance.complementReasonId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.dataSenderId'
                      ),
                      value: issuance.dataSenderId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.amount'
                      ),
                      value: issuance.amount,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.autoCalc'
                      ),
                      value: formatBoolean(issuance.autoCalc),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.claimId'
                      ),
                      value: issuance.claimId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.docAcceptanceId'
                      ),
                      value: issuance.docAcceptanceId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.draftNo'
                      ),
                      value: issuance.draftNo,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.draftReasonId'
                      ),
                      value: issuance.draftReasonId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.reasonId'
                      ),
                      value: issuance.reasonId,
                    },
                    {
                      label: t('outpatientDocAcceptances.issuanceFields.exId'),
                      value: issuance.exId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.isComfort'
                      ),
                      value: formatBoolean(issuance.isComfort),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.issuDate'
                      ),
                      value: issuance.issuDate,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.sourceId'
                      ),
                      value: issuance.sourceId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.exStatus'
                      ),
                      value: issuance.exStatus,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.calcTime'
                      ),
                      value: issuance.calcTime,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.changeTime'
                      ),
                      value: issuance.changeTime,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.paymentPreparationTime'
                      ),
                      value: issuance.paymentPreparationTime,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.calcJobStatus'
                      ),
                      value: issuance.calcJobStatus,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.status'
                      ),
                      value: getStatusTranslationKey(issuance.status) ? (
                        <Badge className={getStatusColorClass(issuance.status)}>
                          {t(
                            getStatusTranslationKey(issuance.status) as string
                          )}
                        </Badge>
                      ) : (
                        issuance.status
                      ),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.claimRequestId'
                      ),
                      value: issuance.claimRequestId,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.wsStatus'
                      ),
                      value: getWsStatusTranslationKey(issuance.wsStatus) ? (
                        <Badge
                          className={getWsStatusColorClass(issuance.wsStatus)}
                        >
                          {t(
                            getWsStatusTranslationKey(
                              issuance.wsStatus
                            ) as string
                          )}
                        </Badge>
                      ) : (
                        issuance.wsStatus
                      ),
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.dmgCases'
                      ),
                      value: issuance.dmgCases?.length ?? 0,
                    },
                    {
                      label: t(
                        'outpatientDocAcceptances.issuanceFields.wsResult'
                      ),
                      value: issuance.wsResult,
                    },
                  ].map((item) => (
                    <ReadonlyItems
                      key={item.label}
                      title={item.label}
                      value={item.value ?? '-'}
                      className='flex flex-wrap items-center'
                    />
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className='p-6 text-center text-sm text-muted-foreground'>
                  {t('outpatientDocAcceptances.messages.noIssuance')}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='damageCases' className='mt-4 space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h3 className='text-lg font-semibold'>
                {t('outpatientDocAcceptances.sections.damageCasesTitle')}
              </h3>
              <Button onClick={() => handleOpen('manageDmgCases')}>
                {t('outpatientDocAcceptances.actions.manageDamageCases')}
              </Button>
            </div>

            {damageCases && damageCases.length > 0 ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {damageCases.map((dmgCase, index) => {
                  const damageCaseKey =
                    dmgCase.id ??
                    `${dmgCase.serviceDate ?? 'unknown-date'}-${dmgCase.medicalSystemCode ?? 'no-code'}-${index}`

                  return (
                    <Card key={damageCaseKey}>
                      <CardContent>
                        <ReadonlyItems
                          title={t(
                            'outpatientDocAcceptances.damageCaseFields.serviceDate'
                          )}
                          value={dmgCase.serviceDate}
                          className='flex flex-wrap items-center'
                        />
                        <ReadonlyItems
                          title={t(
                            'outpatientDocAcceptances.damageCaseFields.medicalSystemCode'
                          )}
                          value={dmgCase.medicalSystemCode}
                          className='flex flex-wrap items-center'
                        />
                        <ReadonlyItems
                          title={t(
                            'outpatientDocAcceptances.damageCaseFields.requestedAmount'
                          )}
                          value={dmgCase.requestedAmount}
                          className='flex flex-wrap items-center'
                        />
                        <ReadonlyItems
                          title={t(
                            'outpatientDocAcceptances.damageCaseFields.approvedAmount'
                          )}
                          value={dmgCase.approvedAmount}
                          className='flex flex-wrap items-center'
                        />
                        <ReadonlyItems
                          title={t(
                            'outpatientDocAcceptances.damageCaseFields.status'
                          )}
                          value={dmgCase.status}
                          className='flex flex-wrap items-center'
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className='p-6 text-center text-sm text-muted-foreground'>
                  {t('outpatientDocAcceptances.messages.noDamageCases')}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
