import { createRouter } from "vue-router";
import { loadComponent, history } from "./helper";

const Layout = () => import("@/layouts/index.vue");
const ScreenLayout = () => import("@/layouts/screenLayout.vue");

// 登录
const Login = () => import("@/views/login/index.vue");

// 大屏
const Dashboard = () => import("@/views/big-screen/index.vue");

// 首页
const Home = () => import("@/views/home/index.vue");

// 设备数据
// const DeviceData = () => import("@/views/device/index.vue");

// 设备管理
const DeviceData = () => import("@/views/device/index.vue");
const DeviceDetail = () => import("@/views/device/detail/index.vue");
const DeviceCommand = () => import("@/views/device/command/index.vue");

// 下发记录
const HistoryRecord = () => import("@/views/command/index.vue");

// 用户管理
const UserList = () => import("@/views/users/index.vue");

// 报文解析
const Parsing = () => import("@/views/message-parser/index.vue");

const Err404 = () => import("@/views/error-page/404.vue");
const Err401 = () => import("@/views/error-page/401.vue");

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
    path: "/screen",
    component: ScreenLayout,
    children: [
      {
        path: "",
        component: Dashboard,
        meta: {
          title: "大屏",
          icon: "icon-dapingzhanshi",
          size: "18px",
          affix: true,
          roles: [1, 2, 3, 4, 5],
        },
      },
    ],
  },
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
          size: "22px",
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
          title: "设备管理",
          icon: "icon-a-RTUguanliweixuan",
          size: "18px",
          affix: true,
          roles: [1],
        },
      },
      {
        path: "detail/:type/:id",
        component: DeviceDetail,
        meta: {
          hidden: true,
          activeMenu: "/device",
        },
      },
      {
        path: "command/:name/:type/:id",
        component: DeviceCommand,
        meta: {
          hidden: true,
          activeMenu: "/device",
        },
      },
    ],
  },
  {
    path: "/command",
    component: Layout,
    children: [
      {
        path: "",
        component: HistoryRecord,
        meta: {
          title: "下发记录",
          icon: "icon-xiafajilu",
          size: "18px",
          roles: [1],
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
          size: "20px",
          roles: [1],
        },
      },
    ],
  },
  {
    path: "/parser",
    component: Layout,
    children: [
      {
        path: "",
        component: Parsing,
        meta: {
          title: "报文解析",
          icon: "icon-baowenjiexi",
          size: "18px",
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
