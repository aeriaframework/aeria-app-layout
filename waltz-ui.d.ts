// WARNING: this file will be overriden
declare module 'waltz-ui' {
  export * from 'waltz-ui/dist'
  type SystemCollections = typeof import('@sonata-api/system/collections')
  type UserCollections = typeof import('../api/src').collections

  type Collections = {
    [K in keyof (SystemCollections & UserCollections)]: Awaited<ReturnType<(SystemCollections & UserCollections)[K]>>
  }

  type SystemStores = typeof import('@waltz-ui/web/stores')
  type UserStores = typeof import('./src/stores')

  type Stores = {
    [P in keyof (SystemStores & UserStores)]: ReturnType<ReturnType<(SystemStores & UserStores)[P]>>
  }

  export const useStore: <TStoreId extends keyof Stores | keyof Collections>(storeId: TStoreId) => TStoreId extends keyof Stores
    ? Stores[TStoreId]
    : import('waltz-ui').CollectionStore<Collections[TStoreId]['item']>
}

declare module '*.yaml' {
  const obj: any
  export default obj
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  import type { TemplateFunctions } from '@waltz-ui/web'

  interface ComponentCustomProperties extends TemplateFunctions {
    instanceConfig: typeof import('waltz-build').InstanceConfig,
    currentUser: typeof import('@sonata-api/system/collections').User
  }
}

export {}
//