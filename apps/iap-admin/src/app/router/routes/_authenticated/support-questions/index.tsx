import { SupportQuestionsPage } from '@features/support-questions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/support-questions/')({
  component: SupportQuestionsPage,
})
