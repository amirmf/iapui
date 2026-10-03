import { RepetitiveResponsesPage } from '@features/repetitive-responses'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/repetitive-responses/')({
  component: RepetitiveResponsesPage,
})
