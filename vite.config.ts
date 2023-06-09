import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import * as path from 'path';
import typescript2 from 'rollup-plugin-typescript2';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          outDir: 'dist',
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      exclude: ['vite.config.ts']
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/components/main.ts',
      name: 'v42',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => `v42.${format}.js`
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/components/main.ts')
      },
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'main.css') return 'v42.css';
          return assetInfo.name;
        },
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
