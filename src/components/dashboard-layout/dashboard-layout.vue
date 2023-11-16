<script setup lang="ts">
import {
  type MenuSchema,
  useStore,
  useNavbar,
  useBreakpoints

} from 'waltz-ui'

import {
  inject,
  ref,
  reactive,
  toRefs,
  computed,
  onMounted

} from 'vue'

import {
  WIcon,
  WContextMenu,
  WPicture,
  WBadge,
  WAsync

} from '@waltz-ui/ui'

const menuSchema = inject<MenuSchema>('menuSchema')

const routerReady = ref(false)
const navbarRefs = reactive({
  routesWithChildren: [],
  isCurrent: (..._args: Parameters<Awaited<ReturnType<typeof useNavbar>>['isCurrent']>) => false
})

const {
  routesWithChildren,
  isCurrent

} = toRefs(navbarRefs)

const router = ROUTER

const metaStore = useStore('meta')
const userStore = useStore('user')
const breakpoints = useBreakpoints()

const push = (...args: Parameters<typeof router.push>) => {
  window.scrollTo(0, 0)
  router.push(...args)

  if( !breakpoints.value.md ) {
    metaStore.menu.visible = false
  }
}

onMounted(async () => {
  const navbar = await useNavbar({ schema: menuSchema })

  Object.assign(navbarRefs, navbar)
  routerReady.value = true
})

const expandedIndex = ref(0)
const expandedMenu = computed(() => routesWithChildren.value[expandedIndex.value])

const logoUrl = new URL('/static/logo.png', import.meta.url).href
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
          @click="push('/dashboard')"
        />
      </div>

      <nav class="dashboard__navbar">
        <div
          v-for="(item, index) in routesWithChildren"
          :key="`item-${index}`"
          class="dashboard__route-group"
        >
          <div
            v-clickable
            v-for="(child, index) in item.children"
            :key="`child-${child.path}`"
            :class="`
              dashboard__route
              ${isCurrent(child) && 'dashboard__route--current'}
            `"
            @click="push({ name: child.name })"
          >
            <w-icon
              :icon="child.meta.icon"
              icon-classes="branded-icon"
            >
              {{ capitalize($t(child.meta.title)) }}
            </w-icon>
          </div>
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
          @click="push('/dashboard')"
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
                <div
                  v-for="role in currentUser.roles"
                  :key="`role-${role}`"
                  class="dashboard__user-context-role"
                >
                  {{ $t(role) }}
                </div>
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
