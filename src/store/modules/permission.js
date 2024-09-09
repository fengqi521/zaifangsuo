import { reactive,ref } from "vue";
import { defineStore } from "pinia";
import { constantRoutes, dynamicRoutes } from "@/router";
// 判断每个路由是否有权限
const isHavePermission = (curRoute, role) => {
  const routeRoles = curRoute?.meta?.roles;
  return routeRoles ? routeRoles.includes(role) : false;
};

// 过滤动态路由
const filterDynamicRoutes = (routes, role) => {
  let newRoutes = [];
  routes.forEach((route) => {
    let curRoute = { ...route };
    if (isHavePermission(curRoute, role)) {
      if (curRoute.children) {
        curRoute.children = filterDynamicRoutes(curRoute.children, role);
      }
     
      if(curRoute.children&&!curRoute.children.length) return;
      newRoutes.push(curRoute);
    }
  });
  
  return newRoutes;
};
export const usePermissionStoreHook = defineStore("permission", () => {
  const routes = ref([]); //全部路由
  const dynamicRealRoutes = reactive([]); // 真实的动态路由

  // 根据角色过滤routes

  const setRoutes = (role) => {
    const accessRoutes = filterDynamicRoutes(dynamicRoutes, role);
    // 赋值
    routes.value = constantRoutes.concat(accessRoutes)
    // Object.assign(routes, constantRoutes.concat(accessRoutes));
    Object.assign(dynamicRealRoutes, accessRoutes);
  };

  return { routes, dynamicRealRoutes, setRoutes };
});
