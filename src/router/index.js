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
const RtuDetail = () => import("@/views/rtu/detail/index.vue");
const RtuCommand = () => import("@/views/rtu/command/index.vue");

// 用户管理
const UserList = () => import("@/views/users/index.vue");

// 报文解析
const Parsing = () => import("@/views/parsing/index.vue");

export const constantRoutes = [
  {
    path: "/login",
    component: Login,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
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
          size:'20px',
          affix: true,
          roles: [1, 2, 3, 4, 5],
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
          roles: [1],
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
          title: "设备管理",
          icon: "icon-a-RTUguanliweixuan",
          size:'22px',
          affix: true,
          roles: [1],
        },
      },
      {
        path: "detail/:type/:id",
        component: RtuDetail,
        meta: {
          hidden: true,
          activeMenu: "/rtu",
        },
      },
      {
        path: "command/:type/:id",
        component: RtuCommand,
        meta: {
          hidden: true,
          activeMenu: "/rtu",
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "",
        component: UserList,
        meta: {
          title: "用户管理",
          icon: "icon-yonghuguanli",
          size:'19px',
          roles: [1],
        },
      },
    ],
  },
  {
    path: "/parsing",
    component: Layout,
    children: [
      {
        path: "",
        component: Parsing,
        meta: {
          title: "报文解析",
          icon: "icon-baowenjiexi",
          roles: [1],
        },
      },
    ],
  },
];
const router = createRouter({
  history,
  routes: constantRoutes,
});

export default router;
