import { PipelinesPage } from '@features/pipelines'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pipelines/')({
  component: PipelinesPage,
  loader: () => ({ crumb: 'pipelines' }),
})
