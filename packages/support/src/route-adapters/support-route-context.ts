import { getSupportFlowContext } from '../model/support-flow-context'

/** Adapt the host's canonical trailing slash to the reference page identity. */
export function getSupportFlowRouteContext(pathname: string) {
  return getSupportFlowContext(pathname.replace(/\/+$/g, '') || '/')
}
