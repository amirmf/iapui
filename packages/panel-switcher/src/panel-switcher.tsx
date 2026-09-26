import { Popover, PopoverContent, PopoverTrigger, cn } from '@iap/ui'
import type { LucideIcon } from 'lucide-react'
import { Check, ChevronDown, PanelsTopLeft } from 'lucide-react'

export type PanelSwitcherItem = {
  href: string
  icon: LucideIcon
  id: string
  label: string
}

export type PanelSwitcherProps = {
  className?: string
  currentPanelAriaLabel: string
  currentPanelId: string
  panels: readonly PanelSwitcherItem[]
  switchAriaLabel: string
  tone?: 'default' | 'inverted'
}

function PanelMenuItem({
  currentPanelId,
  panel,
}: {
  currentPanelId: string
  panel: PanelSwitcherItem
}) {
  const Icon = panel.icon
  const isCurrent = panel.id === currentPanelId

  return (
    <li>
      {isCurrent ? (
        <div
          aria-current='page'
          aria-disabled='true'
          className='border-primary bg-primary/10 text-foreground flex min-h-12 items-center gap-3 border-s-2 px-3'
          role='menuitem'
        >
          <PanelIcon icon={Icon} isCurrent />
          <span className='min-w-0 flex-1 truncate font-medium'>
            {panel.label}
          </span>
          <Check aria-hidden='true' className='text-primary size-4 shrink-0' />
        </div>
      ) : (
        <a
          className='text-foreground hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:ring-primary flex min-h-12 items-center gap-3 px-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset'
          href={panel.href}
          role='menuitem'
        >
          <PanelIcon icon={Icon} isCurrent={false} />
          <span className='min-w-0 flex-1 truncate font-medium'>
            {panel.label}
          </span>
        </a>
      )}
    </li>
  )
}

function PanelIcon({
  icon: Icon,
  isCurrent,
}: {
  icon: LucideIcon
  isCurrent: boolean
}) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md',
        isCurrent
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-primary/10 text-primary'
      )}
    >
      <Icon aria-hidden='true' className='size-4' />
    </span>
  )
}

export function PanelSwitcher({
  className,
  currentPanelAriaLabel,
  currentPanelId,
  panels,
  switchAriaLabel,
  tone = 'default',
}: PanelSwitcherProps) {
  const currentPanel = panels.find((panel) => panel.id === currentPanelId)

  if (!currentPanel || panels.length < 2) {
    return null
  }

  const isInverted = tone === 'inverted'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={switchAriaLabel}
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors outline-none motion-reduce:transition-none sm:w-auto sm:gap-2 sm:px-3',
            isInverted
              ? 'border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80 data-[state=open]:border-white/45 data-[state=open]:bg-white/20'
              : 'border-primary/20 bg-primary/5 text-foreground hover:border-primary/40 hover:bg-primary/10 focus-visible:ring-primary/50 data-[state=open]:border-primary/45 data-[state=open]:bg-primary/15 focus-visible:ring-2',
            className
          )}
          type='button'
        >
          <PanelsTopLeft
            aria-hidden='true'
            className={cn('size-5', !isInverted && 'text-primary')}
          />
          <span className='hidden text-sm font-semibold whitespace-nowrap sm:inline'>
            {currentPanel.label}
          </span>
          <ChevronDown aria-hidden='true' className='hidden size-4 sm:block' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='max-w-[calc(100vw-1rem)] min-w-56 overflow-hidden p-0 motion-reduce:animate-none motion-reduce:transition-none'
        collisionPadding={8}
      >
        <ul aria-label={currentPanelAriaLabel} role='menu'>
          {panels.map((panel) => (
            <PanelMenuItem
              currentPanelId={currentPanelId}
              key={panel.id}
              panel={panel}
            />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
