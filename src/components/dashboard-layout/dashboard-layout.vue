<script setup lang="ts">
import { type MenuSchema, useStore, useNavbar } from 'waltz-ui'
import { WIcon, WContextMenu, WPicture, WBadge } from '@waltz-ui/ui'

import {
  inject,
  ref,
  reactive,
  computed,
  toRefs,
  onMounted

} from 'vue'


import {
  breakpoints,
  navbarRefs,
  routes,
  pushRoute,
  routeClick
} from '../utils'

import NavbarEntry from '../navbar-entry/navbar-entry.vue'
import NavbarEntries from '../navbar-entries/navbar-entries.vue'

const menuSchema = inject<MenuSchema>('menuSchema', [])

const routerReady = ref(false)
const router = ROUTER

const metaStore = useStore('meta')
const userStore = useStore('user')

onMounted(async () => {
  const navbar = await useNavbar({ schema: menuSchema })

  Object.assign(navbarRefs, navbar)
  routerReady.value = true
})

const logoUrl = new URL('/static/logo.png', import.meta.url).href

const topLevelRoutes = computed(() => {
  return routes.value.filter((route) => route.children.length === 0)
})

const parentRoutes = computed(() => {
  return routes.value.filter((route) => route.children.length > 0)
})
</script>


<template>
  <div
    v-if="routerReady"
    class="
      dashboard
      w-body
  ">
    <div :class="`
      no-print
      dashboard__sidebar
      ${ metaStore.menu.visible && 'dashboard__sidebar--visible' }
    `">
      <div class="dashboard__navbar-top">
        <w-icon
          v-if="!breakpoints.md"
          v-clickable
          icon="multiply"
          @click="metaStore.menu.visible = false"
        ></w-icon>

        <img
          v-clickable
          :src="logoUrl"
          class="dashboard__navbar-logo"
          @click="pushRoute('/dashboard')"
        />
      </div>

      <nav class="dashboard__navbar">
        <div
          v-if="topLevelRoutes.length > 0"
          class="dashboard__route-group"
        >
          <navbar-entry
            v-for="(item, index) in topLevelRoutes"
            :key="`item-${index}`"
            :item="item"
            :memo-key="`entry-${index}`"
            @click="routeClick(item)"
          ></navbar-entry>
        </div>

        <div
          v-for="(item, index) in parentRoutes"
          :key="`item-${index}`"
          class="dashboard__route-group"
        >
          <navbar-entries
            :item="item"
            :memo-key="`parent-${index}`"
          ></navbar-entries>
        </div>

      </nav>
    </div>

    <div class="dashboard__content">
      <div class="dashboard__topbar">
        <w-icon
          v-if="!breakpoints.md"
          v-clickable
          icon="bars"
          @click="metaStore.menu.visible = true"
        ></w-icon>

        <img
          v-if="!breakpoints.md"
          v-clickable
          :src="logoUrl"
          class="dashboard__topbar-logo"
          @click="pushRoute('/dashboard')"
        />

        <div
          v-else
          class="dashboard__view-title"
        >
          {{ capitalize(viewTitle) }}
        </div>

        <router-view
          v-if="breakpoints.md"
          name="topbar"
        ></router-view>

        <div class="dashboard__topbar-separator"></div>

        <slot
          v-if="$slots.super"
          name="super"
        ></slot>

        <w-context-menu>
          <div
            v-clickable
            class="dashboard__user"
          >
            <w-picture
              :file-id="currentUser.picture?._id || currentUser.picture"
              class="dashboard__user-picture"
            ></w-picture>

            <div>Olá, {{ currentUser.full_name.split(' ')[0] }}</div>
          </div>

          <template #header>
            <div class="dashboard__user-context-header">
              <div class="tx-text-[12pt]">
                {{ currentUser.full_name }}
              </div>

              <div class="dashboard__user-context-roles">
                <w-badge
                  v-for="role in currentUser.roles"
                  :key="`role-${role}`"
                  large
                >
                  {{ $t(role) }}
                </w-badge>
              </div>
            </div>
          </template>

          <template #profile>
            <w-icon
              icon="user-square"
              @click="router.push('/dashboard/user/profile')"
            >
              Perfil
            </w-icon>
          </template>

          <template #logout>
            <w-icon
              icon="signout"
              @click="userStore.$actions.signout(); router.push('/user/signin')"
            >
              Sair
            </w-icon>
          </template>
        </w-context-menu>

      </div>

      <div class="dashboard__view">
        <router-view
          v-if="!breakpoints.md"
          name="topbar"
        ></router-view>

        <router-view v-slot="{ Component }">
          <component :is="Component"></component>
        </router-view>
      </div>

    </div>
  </div>

</template>

<style scoped src="./dashboard-layout.less"></style>

<style lang="less">
.branded-icon {
  fill: var(--theme-brand-color-shade-2);
}
</style>
