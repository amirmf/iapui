import { Card, CardContent, CardHeader, CardTitle } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

type HomeActionCardProps = {
  description: string
  icon: LucideIcon
  title: string
  to: '/myclaims/' | '/myclaims/create/'
}

export function HomeActionCard({
  description,
  icon: Icon,
  title,
  to,
}: HomeActionCardProps) {
  return (
    <Link className='animated-border-card block h-full no-underline' to={to}>
      <Card className='h-full border-0 text-center'>
        <CardHeader className='justify-items-center gap-4'>
          <span className='grid size-16 place-items-center rounded-full bg-primary/10 text-primary'>
            <Icon aria-hidden='true' className='size-8' />
          </span>
          <CardTitle className='text-xl'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          {description}
        </CardContent>
      </Card>
    </Link>
  )
}
