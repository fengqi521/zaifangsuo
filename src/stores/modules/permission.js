import {reactive} from 'vue'
import { defineStore } from 'pinia'
import {dynamicRoutes} from '@/router'


export const usePermissionStore = defineStore('permission',()=>{
    const routes = reactive(dynamicRoutes)
    
    const setPermissionRoutes = (availableRoutes)=>{
       routes = routes.map(item=>{

       })
    }

    return {routes,setPermissionRoutes}
})