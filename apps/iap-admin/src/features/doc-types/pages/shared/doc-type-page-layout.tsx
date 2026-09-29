type DocTypePageLayoutProps = {
  children: React.ReactNode
  description: string
  title: string
}

export function DocTypePageLayout(props: DocTypePageLayoutProps) {
  const { children, description, title } = props

  return (
    <div className='mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        <p className='text-muted-foreground'>{description}</p>
      </div>
      {children}
    </div>
  )
}
