<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { MenuSchemaNode, MenuAdvancedChild } from 'waltz-ui'
import { isCollapsableRouteOpen, routeClick } from '../utils'
import NavbarEntry from '../navbar-entry/navbar-entry.vue'

type Props = {
  item: MenuSchemaNode
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
    v-for="(child, cindex) in item.children as (MenuAdvancedChild & RouteRecordRaw)[]"
    :key="`child-${cindex}`"
    @click.stop="routeClick(child)"
  >
    <navbar-entry v-bind="{
      item: child,
      level,
      memoKey: `${memoKey}-${cindex}`
    }"></navbar-entry>

    <div v-if="'collapsed' in child && isCollapsableRouteOpen(child)">
      <navbar-entries v-bind="{
        item: child,
        level: level + 1,
        memoKey: `${memoKey}-${cindex}`
      }"></navbar-entries>
    </div>
  </div>

</template>

<style scoped src="./navbar-entries.less"></style>
