import {
  DamageCodesPage,
  damageCodeRouteSearchSchema,
} from '@features/damage-codes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/damage-codes/')({
  component: DamageCodesPage,
  loader: () => ({ crumb: 'damagecode' }),
  validateSearch: damageCodeRouteSearchSchema,
})
