import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true,
    port: 3000,
    /** 是否自动打开浏览器 */
    open: true,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /** 接口代理 */
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        ws: false,
        /** 是否允许跨域 */
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径
      },
    },
    /** 预热常用文件，提高初始页面加载速度 */
    warmup: {
      clientFiles: ["./src/layouts/**/*.vue"],
    },
  },
  plugins: [vue(), vueJsx()],
});
