import type { MobileService } from './types'
import { navigateTo, useRoute } from '#imports'

interface UseSmapServiceRouterOptions {
  beforeNavigate?: (service: MobileService) => void
}

interface UseSmapServiceRouterReturn {
  goToService: (service: MobileService) => void
}

const serviceRoutes: Record<MobileService, string> = {
  'navigation': '/tabs/map',
  'explore': '/tabs/explore',
  'ride-hailing': '/tabs/ride',
  'profile': '/tabs/profile',
}

export function useSmapServiceRouter(options: UseSmapServiceRouterOptions = {}): UseSmapServiceRouterReturn {
  const route = useRoute()

  function goToService(service: MobileService): void {
    options.beforeNavigate?.(service)

    const targetRoute = serviceRoutes[service]

    if (route.path !== targetRoute)
      void navigateTo(targetRoute)
  }

  return { goToService }
}
