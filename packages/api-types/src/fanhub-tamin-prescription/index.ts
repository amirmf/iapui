import { z } from 'zod'

export const fanhubPrescriptionInquiryRequestSchema = z
  .object({
    nationalCode: z.string(),
    prescriptionDate: z.string(),
  })
  .strict()

export type FanhubPrescriptionInquiryRequest = z.infer<
  typeof fanhubPrescriptionInquiryRequestSchema
>

export const fanhubIhioPrintCodeInquiryRequestSchema = z
  .object({
    nationalNumber: z.string(),
    printCode: z.string(),
    userId: z.string().optional(),
  })
  .strict()

export type FanhubIhioPrintCodeInquiryRequest = z.infer<
  typeof fanhubIhioPrintCodeInquiryRequestSchema
>

const fanhubStatusSchema = z.object({
  statusCode: z.number().int().optional(),
  message: z.string().optional(),
})

const fanhubPrescriptionItemBaseSchema = z.object({
  id: z.number().int().optional(),
  patientName: z.string().optional(),
  patientID: z.string().optional(),
  birthDate: z.string().optional(),
  sex: z.string().optional(),
  prescDate: z.string().optional(),
  docName: z.string().optional(),
  docID: z.string().optional(),
  specDesc: z.string().optional(),
  srvName: z.string().optional(),
  srvCode: z.string().optional(),
  insurancePayment: z.number().optional(),
  ssoPayment: z.number().optional(),
  noteHeadEprescID: z.number().int().optional(),
  typeEP: z.string().optional(),
  prescType: z.string().optional(),
  specCode: z.string().optional(),
  requestPrice: z.number().optional(),
  isSpecialPatient: z.number().int().optional(),
  custType: z.string().optional(),
  regDate: z.string().optional(),
  srvCodeMain: z.string().optional(),
  srvNameMain: z.string().optional(),
  custName: z.string().optional(),
  location: z.string().optional(),
  phaPrice: z.number().optional(),
})

export const fanhubDrugPrescriptionSchema =
  fanhubPrescriptionItemBaseSchema.extend({
    qtyDoc: z.number().int().optional(),
    qtyPha: z.string().optional(),
    drgUsg: z.string().optional(),
    drgUsgCode: z.string().optional(),
    drgInst: z.string().optional(),
    drgInstCode: z.string().optional(),
    druqAmt: z.string().optional(),
    druqAmtCode: z.string().optional(),
    phaRequestPrice: z.number().optional(),
  })

export type FanhubDrugPrescription = z.infer<
  typeof fanhubDrugPrescriptionSchema
>

export const fanhubParaClinicPrescriptionSchema =
  fanhubPrescriptionItemBaseSchema.extend({
    rvuCode: z.string().optional(),
    tarefPrice: z.number().optional(),
    qtyDoc: z.number().int().optional(),
  })

export const fanhubOfficeServiceSchema =
  fanhubPrescriptionItemBaseSchema.extend({
    ciamId: z.number().int().optional(),
  })

const createFanhubPrescriptionResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    result: z
      .object({
        data: z
          .object({
            status: z.number().int().optional(),
            family: z.string().optional(),
            reason: z.string().optional(),
            data: z
              .object({
                total: z.number().int().optional(),
                list: z.array(itemSchema).optional(),
              })
              .optional(),
          })
          .optional(),
        status: fanhubStatusSchema.optional(),
      })
      .optional(),
    status: fanhubStatusSchema.optional(),
  })

export const fanhubDrugPrescriptionResponseSchema =
  createFanhubPrescriptionResponseSchema(fanhubDrugPrescriptionSchema)

export const fanhubParaClinicPrescriptionResponseSchema =
  createFanhubPrescriptionResponseSchema(fanhubParaClinicPrescriptionSchema)

export const fanhubOfficeServiceResponseSchema =
  createFanhubPrescriptionResponseSchema(fanhubOfficeServiceSchema)

export type FanhubDrugPrescriptionResponse = z.infer<
  typeof fanhubDrugPrescriptionResponseSchema
>
export type FanhubParaClinicPrescriptionResponse = z.infer<
  typeof fanhubParaClinicPrescriptionResponseSchema
>
export type FanhubOfficeServiceResponse = z.infer<
  typeof fanhubOfficeServiceResponseSchema
>

const fanhubIhioInsuredInfoSchema = z.object({
  resultMessage: z.string().optional(),
  memberId: z.number().int().optional(),
  name: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  lifeStatus: z.string().optional(),
  maritalStatus: z.string().optional(),
  relationType: z.string().optional(),
  registrationStatus: z.string().optional(),
  geoInfo: z.string().optional(),
  geoId: z.number().int().optional(),
  responsibleFullName: z.string().optional(),
  countOfFamilyMembers: z.number().int().optional(),
  age: z.number().int().optional(),
  zipCode: z.string().optional(),
  responsibleNN: z.string().optional(),
  cellPhoneNumber: z.string().optional(),
  productName: z.string().optional(),
  productId: z.number().int().optional(),
  accountValidFrom: z.string().optional(),
  accountValidto: z.string().optional(),
  isCovered: z.boolean().optional(),
  specialAccount: z.string().optional(),
  nationalNumber: z.string().optional(),
})

const fanhubIhioSubscriptionDeliveredInfoSchema = z.object({
  id: z.number().int().optional(),
  description: z.string().optional(),
  serviceId: z.number().int().optional(),
  numberOfDelivered: z.number().int().optional(),
  patientPayment: z.number().optional(),
  amount: z.number().optional(),
  ihioBasePrice: z.number().optional(),
  delivery: z.string().optional(),
  prescriber: z.string().optional(),
  deliverDate: z.string().optional(),
  typeId: z.number().int().optional(),
  consumption: z.string().optional(),
  serviceDescription: z.string().optional(),
  serviceFullName: z.string().optional(),
  serviceInterfaceName: z.string().optional(),
  serviceNationalNumber: z.string().optional(),
  serviceShortName: z.string().optional(),
  shape: z.string().optional(),
  numberOfPeriod: z.number().optional(),
  consumptionSNOMEDCode: z.string().optional(),
  prscId: z.number().int().optional(),
  noRequest: z.number().int().optional(),
})

const fanhubIhioSubscriptionInfoSchema = z.object({
  id: z.number().int().optional(),
  bulkId: z.number().int().optional(),
  description: z.string().optional(),
  numberOfRequest: z.number().int().optional(),
  serviceId: z.number().int().optional(),
  cpartyName: z.string().optional(),
  serviceDescription: z.string().optional(),
  serviceFullName: z.string().optional(),
  serviceInterfaceName: z.string().optional(),
  serviceNationalNumber: z.string().optional(),
  serviceShortName: z.string().optional(),
  serviceGenericCode: z.string().optional(),
  countOfReference: z.number().int().optional(),
  typeId: z.number().int().optional(),
  shape: z.string().optional(),
  consumption: z.string().optional(),
  consumptionInstruction: z.string().optional(),
  prescriptionId: z.number().int().optional(),
  numberOfPeriod: z.number().optional(),
  status: z.string().optional(),
  isMixed: z.boolean().optional(),
  ihioBasePrice: z.number().optional(),
  consumptionSNOMEDCode: z.string().optional(),
  activeFrom: z.number().int().optional(),
  subscriptionDeliveredInfos: z
    .array(fanhubIhioSubscriptionDeliveredInfoSchema)
    .optional(),
})

const fanhubIhioPrescriptionInfoSchema = z.object({
  id: z.number().int().optional(),
  creationDate: z.string().optional(),
  partnerName: z.string().optional(),
  partnerPhone: z.string().optional(),
  nationalNumber: z.string().optional(),
  contractPartyName: z.string().optional(),
  nomedicalSystem: z.number().int().optional(),
  licenseName: z.string().optional(),
  isActive: z.string().optional(),
  samadCode: z.string().optional(),
  typeId: z.number().int().optional(),
  subscriptionInfos: z.array(fanhubIhioSubscriptionInfoSchema).optional(),
})

export const fanhubIhioPrintCodeInquiryResponseSchema = z.object({
  result: z
    .object({
      data: z
        .object({
          resCode: z.number().int().optional(),
          resMessage: z.string().optional(),
          info: z
            .object({
              insuredInfo: fanhubIhioInsuredInfoSchema.optional(),
              prescriptionInfo: z
                .array(fanhubIhioPrescriptionInfoSchema)
                .optional(),
            })
            .optional(),
        })
        .optional(),
      status: fanhubStatusSchema.optional(),
    })
    .optional(),
  status: fanhubStatusSchema.optional(),
})

export type FanhubIhioPrintCodeInquiryResponse = z.infer<
  typeof fanhubIhioPrintCodeInquiryResponseSchema
>
export type FanhubIhioInsuredInfo = z.infer<typeof fanhubIhioInsuredInfoSchema>
export type FanhubIhioPrescriptionInfo = z.infer<
  typeof fanhubIhioPrescriptionInfoSchema
>
