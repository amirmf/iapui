export function getSupportClaimRequestUrl(claimRequestId: string) {
  const path = `/myclaims/${encodeURIComponent(claimRequestId)}`
  const appDomainUrl = import.meta.env.VITE_IAP_APP_DOMAIN_URL

  return appDomainUrl ? new URL(path, appDomainUrl).href : path
}
