import { type CSSProperties, type ReactNode } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@iap/ui'

import type { AuthBrand } from './auth-page.types'

type AuthCardProps = {
  children: ReactNode
  brand: AuthBrand
  description?: string
  footer?: ReactNode
  title: string
}

const authPageBackground: CSSProperties = {
  background: "url('/images/login.png') no-repeat center",
  backgroundSize: 'cover',
}

export function AuthCard(props: AuthCardProps) {
  const { brand, children, description, footer, title } = props

  return (
    <div
      className='bg-muted flex min-h-dvh items-center justify-center px-4 py-8 sm:py-12'
      style={authPageBackground}
    >
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1 text-center'>
          {brand.logoUrl ? (
            <img
              alt={brand.company}
              className='mx-auto h-32 w-32 object-center'
              src={brand.logoUrl}
            />
          ) : null}
          <h1 className='mt-3 text-xl font-semibold'>{brand.title}</h1>
        </CardHeader>
        <CardContent>
          {description ? (
            <div className='mb-6 space-y-1'>
              <p className='text-muted-foreground text-base font-medium'>
                {title}
              </p>
              <p className='text-muted-foreground text-sm'>{description}</p>
            </div>
          ) : (
            <p className='text-muted-foreground mb-3 text-base font-medium'>
              {title}
            </p>
          )}
          {children}
        </CardContent>
        {footer ? (
          <CardFooter className='text-muted-foreground flex flex-col justify-center gap-4 border-t pt-6 text-sm'>
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
