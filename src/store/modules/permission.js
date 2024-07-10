import { reactive } from "vue";
import { defineStore } from "pinia";
import { constantRoutes, dynamicRoutes } from "@/router";
// 判断每个路由是否有权限
const isHavePermission = (curRoute, roles) => {
  const routeRoles = curRoute?.meta?.roles;
  return routeRoles ? roles.some((item) => routeRoles.includes(item)) : true;
};

// 过滤动态路由
const filterDynamicRoutes = (routes, roles) => {
  routes.forEach((route) => {
    let curRoute = { ...route };
    if (isHavePermission(curRoute, roles)) {
      if (curRoute.children) {
        curRoute.children = filterDynamicRoutes(curRoute.children, roles);
      }
    }
  });
};
export const usePermissionStoreHook = defineStore("permission", () => {
  const routes = reactive([]); //全部路由
  const dynamicRealRoutes = reactive([]); // 真实的动态路由

  // 根据角色过滤routes

  const setRoutes = (roles) => {
    const accessRoutes = filterDynamicRoutes(dynamicRoutes, roles);

    // 赋值
    Object.assign(routes, constantRoutes.concat(accessRoutes));
    Object.assign(dynamicRealRoutes, accessRoutes);
  };

  return { routes, dynamicRealRoutes, setRoutes };
});
