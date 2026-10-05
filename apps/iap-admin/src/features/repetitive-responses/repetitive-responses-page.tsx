import RepetitiveResponseGroups from '@features/repetitive-responses/components/groups/repetitive-response-groups'
import RepetitiveResponsesSection from '@features/repetitive-responses/components/responses/repetitive-responses-section'
import { RepetitiveResponseProvider } from '@features/repetitive-responses/context/provider/repetitive-response-provider'

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
