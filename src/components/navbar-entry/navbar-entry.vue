<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { MenuAdvancedChild, MenuAdvancedChildCollapsable } from 'waltz-ui'
import { isCurrent, memoizeBadge, isCollapsableRouteOpen } from '../utils'

type Props = {
  item: MenuAdvancedChild & RouteRecordRaw
  memoKey: string
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})
</script>

<template>
  <div
    :class="`
      navbar__route
      ${isCurrent(item) && 'navbar__route--current'}
      ${level > 0 && 'navbar__route--sub'}
    `"

    :style="`--level-padding: ${1.2*level}rem;`"
  >
    <w-icon
      :icon="item.meta!.icon"
      icon-classes="branded-icon"
    >
      {{ capitalize($t(item.meta!.title)) }}
    </w-icon>

    <w-badge v-if="item.badge" alt>
      <w-async :promise="memoizeBadge(item.badge, memoKey)"></w-async>
    </w-badge>

    <div v-if="'collapsed' in item">
      <w-icon v-if="isCollapsableRouteOpen(item)" icon="angle-up"></w-icon>
      <w-icon v-else icon="angle-down"></w-icon>
    </div>

  </div>
</template>

<style scoped src="./navbar-entry.less"></style>
