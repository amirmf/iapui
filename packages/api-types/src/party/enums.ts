import { z } from 'zod'

/** Roles are assigned to parties and reused by authenticated-user contracts. */
export const partyRoleSchema = z.enum([
  'ROLE_PUBLIC_USER',
  'ROLE_MONITORING_USER',
  'ROLE_ASSESSMENT_USER',
  'ROLE_MAIN_ASSESSMENT_USER',
  'ROLE_HQ_USER',
  'ROLE_ADMIN_USER',
  'ROLE_SUPER_ADMIN',
  'ROLE_SUPER_ADMIN_USER',
  'ROLE_DOCTOR_USER',
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_MAIN_REQUEST_REGISTERY_AGENT',
  'ROLE_BRANCH_USER',
  'ROLE_CUSTOMER_USER',
  'ROLE_TICKET_AGENT',
])
export type PartyRole = z.infer<typeof partyRoleSchema>
