import type { ComponentType } from 'react'

import type { ClaimRequestStatus } from '@iap/api-types'
import {
  AlertTriangle,
  CheckCircle,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Eye,
  FileText,
  GitBranch,
  Trash2,
  Undo2,
  UserCheck,
  XCircle,
} from 'lucide-react'

export const CLAIM_REQUEST_STATUS_ICON_MAP: Record<
  ClaimRequestStatus,
  ComponentType<{ className?: string }>
> = {
  SUBMITTED: FileText,
  IN_REVIEW: Eye,
  IN_ASSESSMENT: Eye,
  DELEGATED: GitBranch,
  DEDICATED_TO_USER: UserCheck,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  FAILED_FETCH_API: AlertTriangle,
  SENT: CircleDollarSign,
  SENT_FAILED: CircleAlert,
  PAID: CircleCheck,
  TERMINATED: AlertTriangle,
  RETURN: Undo2,
  PAYMENT_REJECTED: XCircle,
  PAYMENT_RETURN: Undo2,
  PAYMENT_RETURN_RESEND: Undo2,
  DELETED: Trash2,
}
