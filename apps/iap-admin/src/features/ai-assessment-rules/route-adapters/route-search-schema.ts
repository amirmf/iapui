import { z } from 'zod'

export const aiAssessmentRuleRouteSearchSchema = z
  .object({
    agreementTemplateCode: z.string().optional(),
    definitionType: z.union([z.string(), z.array(z.string())]).optional(),
    direction: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
    'docTypes.docTypeCode': z
      .union([z.string(), z.array(z.string())])
      .optional(),
    extContractId: z.string().optional(),
    extPolicyId: z.string().optional(),
    page: z.string().optional(),
    ruleState: z.union([z.string(), z.array(z.string())]).optional(),
    size: z.string().optional(),
    sort: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .loose()
