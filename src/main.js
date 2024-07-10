// core
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import "@/router/permission"

// plugin
import { loadPlugins } from '@/plugins'

// css
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import '@/styles/index.scss'
const app = createApp(App)

// 加载插件
loadPlugins(app)
app.use(store).use(router)
app.mount('#app')
