import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    alias: {
      'bson': require.resolve('bson')
    }
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'aeria-app-layout',
      formats: [
        'es'
      ]
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.ts')
      },
      output: {
        exports: 'named'
      },
      external: [
        'vue',
        'vue-router',
        /@waltz-ui\//,
        /@sonata-api\//,
      ]
    },
  },
  optimizeDeps: {
    include: [
      'bson',
      '@sonata-api/types',
      '@sonata-api/common'
    ],
    exclude: [
      'vue-router'
    ]
  },
})
