<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { MenuNode } from 'waltz-ui'
import { t } from 'waltz-ui'
import { AeriaIcon, AeriaBadge, AeriaAsync } from '@waltz-ui/ui'
import { isCurrent, memoizeBadge, isCollapsibleRouteOpen } from '../utils'

type Props = {
  item: MenuNode & RouteRecordRaw
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

    :style="`--level-padding: ${level};`"
  >
    <aeria-icon
      :icon="item.meta!.icon!"
      style="
        --icon-size: 1.2rem;
        --icon-color: var(--theme-brand-color-shade-2);
      "
    >
      {{ t(item.meta!.title, { plural: true, capitalize: true }) }}
    </aeria-icon>

    <aeria-badge v-if="item.badge" alt>
      <aeria-async :promise="memoizeBadge(item.badge, memoKey)"></aeria-async>
    </aeria-badge>

    <div v-if="'collapsed' in item">
      <aeria-icon v-if="isCollapsibleRouteOpen(item)" icon="caret-up"></aeria-icon>
      <aeria-icon v-else icon="caret-down"></aeria-icon>
    </div>

  </div>
</template>

<style scoped src="./navbar-entry.less"></style>
