import type { NavItem } from './types'

export function isNavItemActive(
  href: string = '',
  item: NavItem,
  mainNav = false
): boolean {
  const safeHref = typeof href === 'string' ? href : ''
  const cleanHref = safeHref.split('?')[0].replace(/\/$/, '') || '/'
  const cleanItemUrl = item.url
    ? item.url.split('?')[0].replace(/\/$/, '') || '/'
    : ''

  if (
    item.url &&
    (href === item.url ||
      href.split('?')[0] === item.url ||
      cleanHref === cleanItemUrl)
  ) {
    return true
  }

  if (
    item.matchDescendants &&
    item.url &&
    cleanHref.startsWith(`${cleanItemUrl}/`)
  ) {
    return true
  }

  if (item.items && item.items.some((sub) => isNavItemActive(href, sub))) {
    return true
  }

  if (mainNav && item.url) {
    const hrefSegment = cleanHref.split('/')[1]
    const itemSegment = cleanItemUrl.split('/')[1]
    if (hrefSegment && hrefSegment === itemSegment) {
      return true
    }
  }

  return false
}

export function createLinkWithFilter(
  url: string,
  filter?: Record<string, unknown> | null
): string {
  if (filter) {
    const query = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => query.append(key, String(val)))
        } else {
          query.set(key, String(value))
        }
      }
    })
    const qs = query.toString()
    return qs ? `${url}?${qs}` : url
  }
  return url
}
