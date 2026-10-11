import { Fragment } from 'react'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from '@iap/ui'
import { Link, useMatches } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface BreadcrumbProps {
  homePageUrl?: string
}

export function Breadcrumb(props: BreadcrumbProps) {
  const { homePageUrl } = props
  const { t } = useTranslation()
  const matches = useMatches() as Array<{
    loaderData?: {
      crumb?: string
    }
    pathname: string
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
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        <Fragment key='_home'>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={(homePageUrl || '/') as never}>
                {t('breadcrumb.home', 'خانه')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </Fragment>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.path}>
            <BreadcrumbItem>
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path as never}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  )
}
