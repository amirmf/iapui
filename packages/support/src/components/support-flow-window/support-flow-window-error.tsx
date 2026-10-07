import { useSupportFlow } from './use-support-flow'

function SupportFlowWindowError() {
  const { error } = useSupportFlow()

  if (!error) return null
  return (
    <div
      role='alert'
      className='border-destructive/25 bg-destructive/10 text-destructive ring-destructive/10 rounded-2xl border px-4 py-3 text-sm leading-6 font-medium shadow-sm ring-1'
    >
      {error}
    </div>
  )
}

export default SupportFlowWindowError
