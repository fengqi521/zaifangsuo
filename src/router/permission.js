import router from "@/router";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { getUserCookie } from "@/utils/cache/cookie";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const isWhiteList = (path) => {
  return ["/login"].indexOf(path) > -1;
};
let flag = true;
NProgress.configure({ showSpinner: false });
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const info = await getUserCookie();
  const { uid, role } = info;
  if(!role){
    flag = true;
  }
  // 未登录
  if (!uid) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to.path)) return next();
    return next({ path: "/login", replace: true });
  }
  // 登录状态，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" });
  }

  // 已有权限，不再重复添加
  if (!flag) return next();

  try {
    flag = false;
    usePermissionStoreHook().setRoutes(role);
    usePermissionStoreHook().dynamicRealRoutes.forEach((route) =>
      router.addRoute(route)
    );
    // 限制刷新一直显示404页面
    if (to.path === "/404" && to.redirectedFrom) {
      next({ path: to.redirectedFrom.fullPath, replace: true });
    } else {
      next({ ...to, replace: true });
    }
  } catch (err) {
    next("/login");
  }
});

router.afterEach((to) => {
  // setRouteChange(to)
  // setTitle(to.meta.title)
  NProgress.done();
});
