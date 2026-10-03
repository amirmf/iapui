import RepetitiveResponseGroups from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-groups'
import RepetitiveResponsesSection from '@features/repetitive-responses/pages/index/components/responses/repetitive-responses-section'
import { RepetitiveResponseProvider } from '@features/repetitive-responses/model/repetitive-response-provider'

export function RepetitiveResponsesPage() {
  return (
    <RepetitiveResponseProvider>
      <main className='flex flex-col gap-4 pb-4'>
        <RepetitiveResponseGroups />
        <RepetitiveResponsesSection />
      </main>
    </RepetitiveResponseProvider>
  )
}
