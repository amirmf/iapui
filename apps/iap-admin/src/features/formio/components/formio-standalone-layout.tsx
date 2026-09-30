import type { PropsWithChildren, ReactNode } from 'react'

type FormioStandaloneLayoutProps = {
  actions?: ReactNode
}

export function FormioStandaloneLayout({
  actions,
  children,
}: PropsWithChildren<FormioStandaloneLayoutProps>) {
  return (
    <div className='min-h-screen bg-muted/30 text-foreground'>
      <div className='mx-auto flex min-h-screen flex-col gap-2 p-2 ltr:dir-ltr rtl:dir-rtl'>
        {actions ? (
          <div className='flex shrink-0 items-center gap-2'>{actions}</div>
        ) : null}
        <div className='flex-1 overflow-hidden rounded-lg border bg-background shadow-sm'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormioStandaloneLayout
