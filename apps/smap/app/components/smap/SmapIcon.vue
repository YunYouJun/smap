<script setup lang="ts">
import type { Component } from 'vue'
import {
  ArrowLeft,
  ArrowUpDown,
  CarFront,
  Check,
  ChevronDown,
  CircleGauge,
  Compass,
  FileText,
  Filter,
  Footprints,
  Fuel,
  Heart,
  Languages,
  Layers3,
  LocateFixed,
  LogIn,
  Map,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Orbit,
  Pause,
  Play,
  Plus,
  ReceiptText,
  Rocket,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrafficCone,
  TriangleAlert,
  UserRound,
  X,
  Zap,
} from '@lucide/vue'
import type { SmapIconName } from './iconTypes'

interface Props {
  name: SmapIconName
  size?: number
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 1.9,
})

const iconComponents = {
  address: MapPin,
  'arrow-left': ArrowLeft,
  'arrow-up-down': ArrowUpDown,
  bolt: Zap,
  car: CarFront,
  check: Check,
  'chevron-down': ChevronDown,
  close: X,
  compass: Compass,
  favorite: Heart,
  feedback: MessageCircle,
  'file-text': FileText,
  filter: Filter,
  footprints: Footprints,
  fuel: Fuel,
  layers: Layers3,
  languages: Languages,
  locate: LocateFixed,
  login: LogIn,
  map: Map,
  'map-pin': MapPin,
  minus: Minus,
  navigate: Navigation,
  orders: ReceiptText,
  orbit: Orbit,
  pause: Pause,
  play: Play,
  plus: Plus,
  route: Route,
  search: Search,
  settings: Settings,
  shield: ShieldCheck,
  ship: Rocket,
  speed: CircleGauge,
  star: Star,
  supply: Sparkles,
  traffic: TrafficCone,
  'triangle-alert': TriangleAlert,
  user: UserRound,
  vortex: Orbit,
} satisfies Record<SmapIconName, Component>
</script>

<template>
  <component
    :is="iconComponents[props.name]"
    class="smap-icon"
    :size="props.size"
    :stroke-width="props.strokeWidth"
    aria-hidden="true"
  />
</template>

<style scoped>
.smap-icon {
  display: block;
  flex: 0 0 auto;
}
</style>
