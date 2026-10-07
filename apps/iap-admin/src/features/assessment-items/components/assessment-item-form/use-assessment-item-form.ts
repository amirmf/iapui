import { useCallback, useEffect, useMemo } from 'react'

import { useAssessmentItemConfirmDialog } from '@features/assessment-items/context/store/assessment-item-confirm-dialog-store'
import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import {
  type AssessmentItem,
  type AssessmentItemFormType,
  assessmentItemFormSchema,
} from '@features/assessment-items/model/assessment-item-form-contract'
import useDamageCodeById from '@features/assessment-items/queries/use-damage-code-by-id.ts'
import useAssessmentItemsData from '@features/assessment-items/queries/useAssessmentItemsData.ts'
import useDamageCodeDrug from '@features/assessment-items/queries/useDamageCodeDrug.ts'
import assessmentItemService, {
  type AssessmentItemsData,
} from '@features/assessment-items/services/assessment-item-editing-service.ts'
import claimPaymentService from '@features/assessment-items/services/claim-payment-service.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PaymentCalculationRequest } from '@iap/api-types'
import { type ClaimRequest } from '@iap/api-types'
import { type DamageCode } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateDefaultFormValuesArgs {
  claimRequestId: string
  toothNumber?: number[] | null
  amountItem?: string
  damageCode?: DamageCode | null
  withFranchize?: boolean | null
}

const createDefaultFormValues = (
  props: CreateDefaultFormValuesArgs
): AssessmentItemFormType => {
  const {
    amountItem = '',
    toothNumber,
    claimRequestId,
    damageCode,
    withFranchize,
  } = props
  return {
    claimRequestId,
    damageCode: damageCode ?? {
      id: null,
      code: null,
      title: null,
    },
    amountItem,
    estimatedAmount: 0,
    quantity: '1',
    withFranchize: withFranchize ?? true,
    useFloatCoverage: false,
    tariff: !toothNumber ? 'PRIVATE_SECTOR_TARIFF' : null,
    status: 'APPROVED',
    toothNumbers: toothNumber ?? null,
    toothType: 'PERMANENT',
    overrideInsuredPersonId: null,
  }
}

export interface AssessmentItemFormProps {
  assessmentItem?: AssessmentItem | null
  className?: string
  handleCancel?: () => void
  claimRequestId?: string
  claimRequestData?: ClaimRequest
  isAdjustment?: boolean
  adjustmentAssessmentId?: string
  onSuccess?: () => void
}

export function useAssessmentItemForm(props: AssessmentItemFormProps) {
  const {
    assessmentItem,
    className,
    handleCancel,
    claimRequestId = '',
    claimRequestData,
    isAdjustment,
    adjustmentAssessmentId,
    onSuccess,
  } = props
  const { t } = useTranslate()
  const { setOpen } = useAssessmentItem()
  const openConfirmDialog = useAssessmentItemConfirmDialog(
    (state) => state.openDialog
  )

  const isEdit = !!assessmentItem?.id
  const queryClient = useQueryClient()
  const { data: assessmentItemsData, isLoading: isAssessmentItemsDataLoading } =
    useAssessmentItemsData(claimRequestId)
  const { data: getDamageCodeById, isLoading: isGetDamageCodeByIdLoading } =
    useDamageCodeById({
      damageCodeId: assessmentItem?.damageCode?.id,
      enabled: isEdit,
    })
  const damageCodeDrugCondition = useMemo(
    () =>
      !isEdit &&
      claimRequestData?.docType?.docTypeCode ===
        import.meta.env.VITE_ASSESSMENT_ITEM_DAMAGE_CODE_DRUG_CONDITION,
    [claimRequestData?.docType?.docTypeCode, isEdit]
  )
  const { data: damageCodeDrug, isLoading: isDamageCodeDrugLoading } =
    useDamageCodeDrug(damageCodeDrugCondition)

  const form = useForm<AssessmentItemFormType>({
    resolver: zodResolver(useMemo(() => assessmentItemFormSchema(t), [t])),
    defaultValues: createDefaultFormValues({ claimRequestId }),
    mode: 'all',
  })
  const { handleSubmit, reset } = form

  const isToothDocType =
    claimRequestData?.docType?.docTypeCode ===
    import.meta.env.VITE_ASSESSMENT_ITEM_TOOTH_DOC_TYPE

  // const isDocTypeDuplicate =
  //   claimRequestData?.docType?.docTypeCode === 'visit' ||
  //   claimRequestData?.docType?.docTypeCode === 'injection'

  const tariffAmountItemRemain = useMemo(() => {
    const claimRequestAmount = claimRequestData?.amount || 0
    const assessmentDataList = assessmentItemsData || []
    let finalAssessmentList = assessmentDataList
    if (assessmentItem?.id) {
      finalAssessmentList = assessmentDataList.filter(
        (item) => item.id !== assessmentItem?.id
      )
    }
    const totalAssessment =
      finalAssessmentList?.reduce((acc, curr) => {
        return acc + (curr.estimatedAmount || 0)
      }, 0) || 0

    const finalAmountItem =
      claimRequestAmount > totalAssessment
        ? claimRequestAmount - totalAssessment
        : 0

    return finalAmountItem ? finalAmountItem.toString() : ''
  }, [assessmentItem?.id, assessmentItemsData, claimRequestData?.amount])

  // Reset form when accordion opens with proper values
  useEffect(() => {
    const isTooth = getDamageCodeById?.isDentalService === 1
    if (!isAssessmentItemsDataLoading && !isDamageCodeDrugLoading) {
      if (isEdit && assessmentItem) {
        const toothNumber = assessmentItem.toothNumber ?? null
        let toothNumbers = assessmentItem.toothNumbers
          ? assessmentItem.toothNumbers
          : toothNumber
            ? [toothNumber]
            : null
        if (isTooth && !toothNumbers) {
          toothNumbers = []
        }
        if (!isTooth) {
          toothNumbers = null
        }
        const formValues: AssessmentItemFormType = {
          claimRequestId: assessmentItem.claimRequestId ?? claimRequestId,
          damageCode: assessmentItem.damageCode
            ? {
                id: assessmentItem.damageCode.id ?? '',
                code: assessmentItem.damageCode.code,
                title: assessmentItem.damageCode.title,
                isDentalService: getDamageCodeById?.isDentalService,
              }
            : {
                id: null,
                code: null,
                title: null,
              },
          amountItem:
            assessmentItem?.amountItem != null
              ? String(assessmentItem.amountItem)
              : assessmentItem?.estimatedAmount
                ? String(
                    Math.ceil(
                      assessmentItem?.estimatedAmount /
                        (assessmentItem.quantity || 1)
                    )
                  )
                : '',
          estimatedAmount: assessmentItem?.estimatedAmount || 0,
          quantity:
            assessmentItem.quantity != null
              ? String(assessmentItem.quantity)
              : '1',
          withFranchize: true,
          useFloatCoverage: assessmentItem.overrideInsuredPersonId != null,
          status: assessmentItem.status ?? 'APPROVED',
          toothNumbers,
          toothType: assessmentItem.toothType,
          overrideInsuredPersonId:
            assessmentItem.overrideInsuredPersonId ?? null,
        }
        reset(formValues)
      } else {
        reset(
          createDefaultFormValues({
            claimRequestId,
            toothNumber: isTooth ? [] : null,
            amountItem: tariffAmountItemRemain,
            damageCode: damageCodeDrug,
            withFranchize: !damageCodeDrug,
          })
        )
      }
    }
  }, [
    assessmentItem,
    claimRequestId,
    damageCodeDrug,
    getDamageCodeById?.isDentalService,
    isAssessmentItemsDataLoading,
    isDamageCodeDrugLoading,
    isEdit,
    reset,
    tariffAmountItemRemain,
  ])

  const { reset: calculateReset, mutateAsync: calculateMutateAsync } =
    useMutation({
      mutationFn: (payload: PaymentCalculationRequest) =>
        claimPaymentService.calculate(payload),
    })

  const { mutateAsync: createMutateAsync } = useMutation({
    mutationFn: assessmentItemService.create,
  })

  const { mutateAsync: updateMutateAsync } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssessmentItem> }) =>
      assessmentItemService.update(id, data),
  })

  // const { mutateAsync: adjustmentMutateAsync } = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<AssessmentItem> }) =>
  //     assessmentItemService.update(id, data),
  //   onSuccess: async () => {
  //     await refetch()
  //     toast.success(t('assessmentItems.messages.updated'))
  //     onOpenChange(false)
  //   },
  // })

  const onReset = useCallback(() => {
    calculateReset()
    reset(
      createDefaultFormValues({
        claimRequestId,
      })
    )
    handleCancel?.()
    setOpen(null)
  }, [calculateReset, claimRequestId, handleCancel, reset, setOpen])

  const onSubmit = async (data: AssessmentItemFormType) => {
    try {
      // calculate
      const payload: PaymentCalculationRequest = {
        claimRequestId: claimRequestId,
        damageCode: String(data.damageCode?.code),
        amount: Number(data.amountItem) * Number(data.quantity),
        amountItem: Number(data.amountItem),
        quantity: Number(data.quantity),
      }
      if (data.tariff) {
        payload.priceType = data.tariff
      }
      if (assessmentItem?.id) {
        payload.assessmentItemId = assessmentItem.id
      }
      if (!data.withFranchize) {
        payload.franchisePercentage = 0
      }
      if (data.overrideInsuredPersonId) {
        payload.overrideInsuredPersonId = data.overrideInsuredPersonId
      }
      let calculationResponse = await calculateMutateAsync(payload)
      if (calculationResponse.payAmount) {
        let maxCoverageCondition =
          calculationResponse.maxCoverageAmount === 0 ||
          calculationResponse.maxCoverageAmount ===
            calculationResponse.payAmount

        if (maxCoverageCondition && payload.franchisePercentage !== 0) {
          payload.franchisePercentage = 0
          calculationResponse = await calculateMutateAsync(payload)
          maxCoverageCondition =
            calculationResponse.maxCoverageAmount === 0 ||
            calculationResponse.maxCoverageAmount ===
              calculationResponse.payAmount
        }
        if (maxCoverageCondition) {
          openConfirmDialog('max-coverage')
        }
        if (
          calculationResponse.amountItem &&
          calculationResponse.maxPerCaseAmount &&
          Number(data.amountItem) > calculationResponse.amountItem
        ) {
          openConfirmDialog('max-per-case')
        }

        const toothNumbers =
          data.toothNumbers != null && data.toothNumbers.length > 0
            ? data.toothNumbers
            : null

        const finalPayload: AssessmentItemsData = {
          claimRequestId: data.claimRequestId,
          damageCode: data.damageCode,
          estimatedAmount:
            calculationResponse.amount ||
            Number(data.amountItem) * Number(data.quantity),
          amountItem: calculationResponse.amountItem || Number(data.amountItem),
          quantity: Number(data.quantity),
          franchizeDeductionAmount: calculationResponse.franchiseAmount || 0,
          franchizeDeductionAmountItem:
            calculationResponse.franchiseAmountItem || 0,
          amount: calculationResponse.payAmount || 0,
          status: 'APPROVED',
          toothNumbers,
          toothType: toothNumbers != null ? data.toothType : null,
          remainCoverageAmount: calculationResponse?.maxCoverageAmount ?? null,
          maxPerCaseAmount: calculationResponse?.maxPerCaseAmount ?? null,
          overrideInsuredPersonId:
            calculationResponse?.overrideInsuredPersonId ?? null,
        }

        // edit
        if (!isAdjustment && isEdit && assessmentItem?.id) {
          if (
            data.toothNumbers == null &&
            (assessmentItem.toothNumbers != null ||
              assessmentItem.toothNumber != null)
          ) {
            finalPayload.toothNumbers = null
            finalPayload.toothNumber = null
          }
          await updateMutateAsync({
            id: assessmentItem.id,
            data: {
              ...assessmentItem,
              ...finalPayload,
            },
          })
          toast.success(t('assessmentItems.messages.updated'))
        } else if (!isAdjustment) {
          // create
          await createMutateAsync(finalPayload)
          toast.success(t('assessmentItems.messages.created'))
        } else if (isAdjustment) {
          // adjustment
          if (!adjustmentAssessmentId) {
            throw new Error('Assessment item id not found.')
          }

          const assessmentItem = await assessmentItemService.getById(
            adjustmentAssessmentId
          )
          const updatePayload = { ...assessmentItem }
          delete updatePayload.updatedAt

          const nextPayload = produce(updatePayload, (draft) => {
            draft.claimRequestAdjustment = {
              title: '-',
              description: '-',
              totalSumAmount: finalPayload.amount,
              ...finalPayload,
              status: 'SUBMITTED',
            }
          })
          await updateMutateAsync({
            id: adjustmentAssessmentId,
            data: nextPayload,
          })
          toast.success(t('assessmentItems.messages.updated'))
        }
        await queryClient.invalidateQueries({
          queryKey: ['assessmentItems'],
        })
        onReset()
        onSuccess?.()
      } else {
        openConfirmDialog('calculate')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
    }
  }

  const isLoadingApiCall =
    isGetDamageCodeByIdLoading ||
    isAssessmentItemsDataLoading ||
    isDamageCodeDrugLoading

  return {
    form,
    handleSubmit,
    onSubmit,
    isLoadingApiCall,
    isEdit,
    isAdjustment,
    claimRequestData,
    tariffAmountItemRemain,
    isToothDocType,
    claimRequestId,
    onReset,
    className,
  }
}
