<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { MenuNode } from 'waltz-ui'
import { isCollapsibleRouteOpen, routeClick } from '../utils'
import NavbarEntry from '../navbar-entry/navbar-entry.vue'

type Props = {
  item: MenuNode
  memoKey: string
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})
</script>

<template>
  <div
    v-clickable
    v-for="(child, cindex) in item.children as (MenuNode & RouteRecordRaw)[]"
    :key="`child-${cindex}`"
    @click.stop="routeClick(child)"
  >
    <navbar-entry
      v-if="'meta' in child"
      v-bind="{
        item: child,
        level,
        memoKey: `${memoKey}-${cindex}`
    }"></navbar-entry>

    <div v-if="isCollapsibleRouteOpen(child)">
      <navbar-entries v-bind="{
        item: child,
        level: level + 1,
        memoKey: `${memoKey}-${cindex}`
      }"></navbar-entries>
    </div>
  </div>

</template>
