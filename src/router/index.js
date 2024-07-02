import { createRouter } from "vue-router";
import { loadComponent, history } from "./helper";

const Layout = () => import("@/layouts/index.vue");
// 登录
const Login = () => import("@/views/login/index.vue");
// 首页
const Home = () => import("@/views/home/index.vue");
const Err404 = () => import("@/views/error-page/404.vue");
const Err401 = () => import("@/views/error-page/401.vue");

// 设备数据
const DeviceData = () => import("@/views/device/index.vue");

// 用户管理
const UserIndex = () => import("@/views/users/user/index.vue");
const UserPermission = () => import("@/views/users/permission/index.vue");
const UserRoles = () => import("@/views/users/roles/index.vue");
export const constantRoutes = [
  {
    path: "/login",
    component: Login,
    hidden: true,
  },
  {
    path: "/404",
    component: Err404,
    hidden: true,
  },
  {
    path: "/401",
    component: Err401,
    hidden: true,
  },
];
export const dynamicRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    hidden: true,
    icon:'icon-ai-home',
    children: [
      {
        path: "home",
        component: Home,
        meta: {
          name: "首页",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/device",
    component: Layout,
    hidden: true,
    icon:'icon-shuju',
    children: [
      {
        path: "",
        component: DeviceData,
        meta: {
          name: "设备数据",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/base",
    component: Layout,
    redirect: "/base/item",
    hidden: true,
    children: [
      {
        path: "base/item",
        component: Home,
        meta: {
          name: "项目管理",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index",
        component: UserIndex,
        name: "用户管理",
      },
      {
        path: "permission",
        component: UserPermission,
        name: "权限管理",
      },
      {
        path: "roles",
        component: UserRoles,
        name: "角色管理",
      },
    ],
  }
];
const router = createRouter({
  history,
  routes: constantRoutes.concat(dynamicRoutes),
});

export default router;
