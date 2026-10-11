import { useCallback } from 'react'

import { useThemeStore } from '@iap/theme'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ScrollArea,
} from '@iap/ui'
import {
  IconArrowRightDashed,
  IconChevronRight,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useSidebarData } from './data/sidebar-data'
import { useSearch } from './search-context'

export function CommandMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setTheme = useThemeStore((state) => state.setTheme)
  const { open, setOpen } = useSearch()
  const sidebarData = useSidebarData()

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={t('command.placeholder', 'Type a command or search...')}
      />
      <CommandList>
        <ScrollArea className='h-72 pr-1' type='hover'>
          <CommandEmpty>
            {t('command.noResults', 'No results found.')}
          </CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup
              key={group.title ?? 'navigation'}
              heading={group.title ?? undefined}
            >
              {group.items.map((navItem, i) => {
                if (navItem.url) {
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url as never }))
                      }}
                      value={navItem.title}
                    >
                      <div className='flex size-4 items-center justify-center ltr:mr-2 rtl:ml-2'>
                        <IconArrowRightDashed className='size-2 text-muted-foreground/80 rtl:rotate-180' />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  )
                }

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url as never }))
                    }}
                    value={`${navItem.title}-${subItem.url}`}
                  >
                    <div className='flex size-4 items-center justify-center ltr:mr-2 rtl:ml-2'>
                      <IconArrowRightDashed className='size-2 text-muted-foreground/80 rtl:rotate-180' />
                    </div>
                    {navItem.title}{' '}
                    <IconChevronRight className='rtl:rotate-180' />{' '}
                    {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading={t('command.theme', 'Theme')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <IconSun className='size-4' />{' '}
              <span>{t('common.theme.light', 'Light')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <IconMoon className='size-4 scale-90' />{' '}
              <span>{t('common.theme.dark', 'Dark')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <IconDeviceLaptop className='size-4' />{' '}
              <span>{t('common.theme.system', 'System')}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
