import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copyPlugin from 'rollup-plugin-copy'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        copyPlugin({
          targets: [{ src: 'src/index.d.ts',dest: 'dist/' }]
          ,hook: 'writeBundle'
        }),
      ],
    },
    lib: {
      entry:  'src/index.ts', // 设置入口文件
      name: 'undoredo', // 起个名字，安装、引入用
      fileName: (format) => `index.${format}.js` // 打包后的文件名
    },
    sourcemap: false, // 输出.map文件
    
  },
  plugins: [vue()],
})
