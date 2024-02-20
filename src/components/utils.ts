import type { Router, RouteRecordRaw } from 'vue-router'
import type { MenuNode } from 'waltz-ui'
import { useStore, useBreakpoints, useNavbar } from 'waltz-ui'
import { reactive, toRefs } from 'vue'

export const breakpoints = useBreakpoints()

export const badgeMemo: Record<string, any> = {}

export const navbarRefs = reactive({
  routes: [] as any[],
  router: {} as Pick<Router, 'push'>,
  isCurrent: (..._args: Parameters<Awaited<ReturnType<typeof useNavbar>>['isCurrent']>) => false
})

export const memoizeBadge = (promise: () => Promise<any> | any, key: string) => {
  if( key in badgeMemo ) {
    return badgeMemo[key]
  }

  const result = badgeMemo[key] = promise()
  return result
}

export const pushRoute = (...args: Parameters<Router['push']>) => {
  if( !breakpoints.value.md ) {
    const metaStore = useStore('meta')
    metaStore.menu.visible = false
  }

  window.scrollTo(0, 0)
  return navbarRefs.router.push(...args)
}

export const { routes, isCurrent } = toRefs(navbarRefs)

export const navbarEntryOpen = (node: MenuNode): boolean | undefined => {
  if( 'children' in node ) {
    return node.children!.some((child) => {
      if( typeof child === 'string' ) {
        return
      }

      if( 'path' in child ) {
        return isCurrent.value(child as RouteRecordRaw)
      }

      if( 'children' in child ) {
        return navbarEntryOpen(child)
      }
    })
  }
}

export const isCollapsibleRouteOpen = (node: MenuNode) => {
  if( !('collapsed' in node) ) {
    if( !('children' in node) ) {
      return false
    }
    return true
  }

  if( node.collapsed !== 'user' && navbarEntryOpen(node) ) {
    node.collapsed = false
    return true
  }

  return !node.collapsed
}

export const routeClick = (node: MenuNode) => {
  if( 'collapsed' in node ) {
    node.collapsed = node.collapsed
      ? false
      : 'user'
    return
  }

  pushRoute({
    path: node.path!
  })
}
