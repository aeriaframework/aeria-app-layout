// WARNING: this file will be overriden
declare global {
  type UnpackCollections<TCollections> =  {
    [P in keyof TCollections]: TCollections[P] extends infer Candidate
      ? Candidate extends (...args: any[]) => infer Coll
        ? Coll
        : Candidate
      : never
  }

  type Collections = typeof import('../api/src') extends infer EntrypointModule
    ? 'collections' extends keyof EntrypointModule
      ? UnpackCollections<EntrypointModule['collections']>
      : 'default' extends keyof EntrypointModule
        ? EntrypointModule['default'] extends infer Entrypoint
          ? 'options' extends keyof Entrypoint
            ? 'collections' extends keyof Entrypoint['options']
              ? UnpackCollections<Entrypoint['options']['collections']>
              : never
            : never
          : never
        : never
    : never
}

declare module 'aeria-ui' {
  export * from 'aeria-ui/dist'

  type SystemStores = typeof import('@aeria-ui/web/stores')
  type UserStores = typeof import('./src/stores')

  type Stores = {
    [P in keyof (SystemStores & UserStores)]: ReturnType<(SystemStores & UserStores)[P]>
  }

  export const useStore: <TStoreId extends keyof Stores | keyof Collections>(
    storeId: TStoreId,
    manager?: import('@aeria-ui/state-management').GlobalStateManager
  ) => TStoreId extends keyof Stores
    ? Stores[TStoreId]
    : TStoreId extends keyof Collections
      ? 'item' extends keyof Collections[TStoreId]
        ? Collections[TStoreId]['item'] extends infer Item
          ? Item extends { _id: any }
            ? import('aeria-ui').CollectionStore<Item>
            : never
          : never
        : never
      : never
}

declare module '@vue/runtime-core' {
  import type { TemplateFunctions } from '@aeria-ui/web'

  interface ComponentCustomProperties extends TemplateFunctions {
    viewTitle: string
    viewIcon: string
    instanceConfig: typeof import('aeria-build').InstanceConfig
    currentUser: (typeof import('../api/src').collections.user extends infer UserCollection
      ? UserCollection extends (...args: any[]) => any
        ? ReturnType<UserCollection>
        : UserCollection
      : never
    ) extends infer Coll
      ? Coll['item']
      : never
    t: typeof import('@aeria-ui/i18n').t
  }
}

import type { RouteRecordRaw } from 'vue-router'
import type { Icon } from '@aeriajs/types'

declare global {
  const definePage: (page: Partial<RouteRecordRaw> & {
    meta: {
      title: string
      icon?: Icon
    }
  }) => void
}

export {}
//