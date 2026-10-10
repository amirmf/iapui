import type { ComponentProps } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

type LinkProps = ComponentProps<typeof Link>

type HomeActionCardProps = {
  description: string
  icon: LucideIcon
  title: string
  to: LinkProps['to']
  search?: Record<string, unknown>
}

export function HomeActionCard({
  description,
  icon: Icon,
  title,
  to,
  search,
}: HomeActionCardProps) {
  return (
    <Link
      className='no-underline'
      to={to}
      search={search as unknown as LinkProps['search']}
    >
      <div className='animated-border-card'>
        <Card className='h-full cursor-pointer border-0 transition-colors duration-300 hover:bg-primary-50/30'>
          <CardHeader className='flex flex-col items-center space-y-4 text-center'>
            <div className='rounded-full bg-primary/10 p-4'>
              <Icon aria-hidden='true' className='h-8 w-8 text-primary' />
            </div>
            <CardTitle className='text-xl'>{title}</CardTitle>
          </CardHeader>
          <CardContent className='text-center text-muted-foreground'>
            {description}
          </CardContent>
        </Card>
      </div>
    </Link>
  )
}

export default HomeActionCard
