import { SupportFeaturesSection } from './components/support-features/support-features-section'
import { SupportPagesSection } from './components/support-pages/support-pages-section'
import { SupportQuestionsSection } from './components/support-questions/support-questions-section'
import { SupportQuestionProvider } from './context'

export function SupportQuestionsPage() {
  return (
    <SupportQuestionProvider>
      <div className='space-y-6 pb-5'>
        <SupportQuestionsSection />
        <div className='grid gap-6 lg:grid-cols-2'>
          <SupportPagesSection />
          <SupportFeaturesSection />
        </div>
      </div>
    </SupportQuestionProvider>
  )
}

export default SupportQuestionsPage
