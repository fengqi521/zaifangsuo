import router from "@/router";
import { userInfoStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const isWhiteList = (path) => {
  return ["/login", "/404", "/401"].indexOf(path) > -1;
};

NProgress.configure({ showSpinner: false });
router.beforeEach(async (to, from, next) => {
  const { setRoutes, dynamicRealRoutes } = usePermissionStoreHook();
  const { userInfo, getUserInfo } = userInfoStoreHook();
  const { uid } = userInfo;

  
  NProgress.start();

  try {
    await getUserInfo(); // 确保 getUserInfo 是异步的并等待其完成
  } catch (error) {}

  // 未登录
  if (!uid) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to.path)) return next();

    // 其他没有访问权限的页面将被重定向到登录页面
    return next({ path: "/login", replace: true });
  }
  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" });
  }

  // 否则要重新获取权限角色
  try {
    //   await userStore.getInfo()
    //   const roles = userStore.roles
    setRoutes(roles);
    //   // 将 "有访问权限的动态路由" 添加到 Router 中
    dynamicRealRoutes.forEach((route) => router.addRoute(route));
    //   // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true });
  } catch (err) {
    //   userStore.resetToken()
    next("/login");
  }
});

router.afterEach((to) => {
  // setRouteChange(to)
  // setTitle(to.meta.title)
  NProgress.done();
});
