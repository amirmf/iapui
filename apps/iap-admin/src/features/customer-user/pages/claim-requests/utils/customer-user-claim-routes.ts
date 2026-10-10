export const customerUserClaimRoutes = {
  list: '/customer-user/claim-requests',
  management: (claimRequestId: string) =>
    `/customer-user/claim-requests/${claimRequestId}/claim-request-management`,
} as const
