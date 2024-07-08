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

// rtu管理
const RtuData = () => import("@/views/rtu/index.vue");

// 基础管理
// const BaseProject = () => import("@/views/base/project/index.vue");
// const BaseStation = () => import("@/views/base/station/index.vue");

// 用户管理
const UserList = () => import("@/views/users/list/index.vue");
const UserPermission = () => import("@/views/users/permission/index.vue");
export const constantRoutes = [
  {
    path: "/login",
    component: Login,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/404",
    component: Err404,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/401",
    component: Err401,
    meta: {
      hidden: true,
    },
  },
];
export const dynamicRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: Home,
        meta: {
          title: "首页",
          icon: "icon-ai-home",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/device",
    component: Layout,
    children: [
      {
        path: "",
        component: DeviceData,
        meta: {
          title: "设备数据",
          icon: "icon-shebeishuju",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/rtu",
    component: Layout,
    children: [
      {
        path: "",
        component: RtuData,
        meta: {
          title: "rtu管理",
          icon: "icon-a-RTUguanliweixuan",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    meta: {
      title: "用户管理",
      icon: "icon-yonghuguanli",
    },
    children: [
      {
        path: "list",
        component: UserList,
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "permission",
        component: UserPermission,
        meta: {
          title: "权限管理",
        },
      },
    ],
  },
];
const router = createRouter({
  history,
  routes: constantRoutes.concat(dynamicRoutes),
});

export default router;
