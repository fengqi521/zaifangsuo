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

// 基础管理
const BaseProject = () => import("@/views/base/project/index.vue");
const BaseStation = () => import("@/views/base/station/index.vue");

// 用户管理
const UserIndex = () => import("@/views/users/user/index.vue");
const UserPermission = () => import("@/views/users/permission/index.vue");
const UserRoles = () => import("@/views/users/roles/index.vue");
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
          icon: "icon-shuju",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/base",
    component: Layout,
    redirect: "/base/project",
    meta: {
      title: "基础管理",
      icon: "icon-jichuguanli",
    },
    children: [
      {
        path: "project",
        component: BaseProject,
        meta: {
          title: "项目管理",
          affix: true,
        },
      },
      {
        path: "station",
        component: BaseStation,
        meta: {
          title: "监测站管理",
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
        path: "index",
        component: UserIndex,
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
      {
        path: "roles",
        component: UserRoles,
        meta: {
          title: "角色管理",
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
