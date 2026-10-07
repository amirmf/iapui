import { Fragment } from 'react'

import { Link, useMatches } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AdminBreadcrumbProps {
  homePageUrl?: string
}

export function AdminBreadcrumb({ homePageUrl = '/' }: AdminBreadcrumbProps) {
  const { t } = useTranslation()
  const matches = useMatches() as Array<{
    pathname: string
    loaderData?: {
      crumb?: string
    }
  }>

  const crumbs = matches
    .filter((match) => match.loaderData?.crumb)
    .map((match) => ({
      label: String(t(`breadcrumb.${match.loaderData!.crumb}` as never)),
      path: match.pathname,
    }))

  if (crumbs.length <= 0) {
    return null
  }

  return (
    <nav aria-label='مسیر جاری' className='hidden sm:block'>
      <ol className='flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm'>
        <li>
          <Link
            className='transition-colors hover:text-foreground'
            to={homePageUrl as never}
          >
            {t('breadcrumb.home')}
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <Fragment key={crumb.path}>
              <li aria-hidden='true'>
                <ChevronLeft className='size-3.5 shrink-0 ltr:rotate-180 rtl:rotate-0' />
              </li>
              <li>
                {isLast ? (
                  <span
                    aria-current='page'
                    className='font-medium text-foreground'
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    className='transition-colors hover:text-foreground'
                    to={crumb.path as never}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
