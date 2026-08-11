import type { SmapIconName } from './iconTypes'
import type { MessageKey } from '~/i18n/messages'

export interface ProfileShortcut {
  id: string
  labelKey: MessageKey
  valueKey: MessageKey
  icon: SmapIconName
  tone: 'blue' | 'green' | 'orange' | 'slate'
}

export interface ProfileAsset {
  id: string
  labelKey: MessageKey
  valueKey: MessageKey
  tone: 'blue' | 'green' | 'orange'
}

export interface ProfileService {
  id: string
  labelKey: MessageKey
  descriptionKey: MessageKey
  icon: SmapIconName
  badgeKey?: MessageKey
}

export interface ProfileTrip {
  id: string
  routeKey: MessageKey
  metaKey: MessageKey
  statusKey: MessageKey
}

export const profileShortcuts: ProfileShortcut[] = [
  {
    id: 'footprints',
    labelKey: 'profile.shortcut.footprints',
    valueKey: 'profile.shortcut.footprintsValue',
    icon: 'footprints',
    tone: 'green',
  },
  {
    id: 'orders',
    labelKey: 'profile.shortcut.orders',
    valueKey: 'profile.shortcut.ordersValue',
    icon: 'orders',
    tone: 'blue',
  },
  {
    id: 'favorites',
    labelKey: 'profile.shortcut.favorites',
    valueKey: 'profile.shortcut.favoritesValue',
    icon: 'favorite',
    tone: 'orange',
  },
  {
    id: 'settings',
    labelKey: 'profile.shortcut.settings',
    valueKey: 'profile.shortcut.preferences',
    icon: 'settings',
    tone: 'slate',
  },
]

export const profileAssets: ProfileAsset[] = [
  {
    id: 'coupon',
    labelKey: 'profile.asset.coupons',
    valueKey: 'profile.asset.couponsValue',
    tone: 'orange',
  },
  {
    id: 'points',
    labelKey: 'profile.asset.points',
    valueKey: 'profile.asset.pointsValue',
    tone: 'blue',
  },
  {
    id: 'carbon',
    labelKey: 'profile.asset.greenMileage',
    valueKey: 'profile.asset.greenMileageValue',
    tone: 'green',
  },
]

export const profileServices: ProfileService[] = [
  {
    id: 'address',
    labelKey: 'profile.service.address',
    descriptionKey: 'profile.service.addressDescription',
    icon: 'address',
  },
  {
    id: 'vehicle',
    labelKey: 'profile.service.vehicle',
    descriptionKey: 'profile.service.vehicleDescription',
    icon: 'car',
  },
  {
    id: 'offline',
    labelKey: 'profile.service.offline',
    descriptionKey: 'profile.service.offlineDescription',
    icon: 'map',
    badgeKey: 'common.update',
  },
  {
    id: 'security',
    labelKey: 'profile.service.security',
    descriptionKey: 'profile.service.securityDescription',
    icon: 'shield',
  },
  {
    id: 'invoice',
    labelKey: 'profile.service.invoice',
    descriptionKey: 'profile.service.invoiceDescription',
    icon: 'file-text',
  },
  {
    id: 'feedback',
    labelKey: 'profile.service.feedback',
    descriptionKey: 'profile.service.feedbackDescription',
    icon: 'feedback',
  },
]

export const profileTrips: ProfileTrip[] = [
  {
    id: 'earth-mars',
    routeKey: 'profile.trip.earthMarsRoute',
    metaKey: 'profile.trip.earthMarsMeta',
    statusKey: 'profile.trip.completed',
  },
  {
    id: 'vega',
    routeKey: 'profile.trip.vegaRoute',
    metaKey: 'profile.trip.vegaMeta',
    statusKey: 'profile.trip.saved',
  },
]
