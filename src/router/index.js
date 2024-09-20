import { createRouter } from "vue-router";
import { loadComponent, history } from "./helper";

const Layout = () => import("@/layouts/index.vue");
const ScreenLayout = () => import("@/layouts/screenLayout.vue");

// 登录
const Login = () => import("@/views/login/index.vue");

// 大屏
const Dashboard = () => import("@/views/dashboard/index.vue");

// 首页
const Home = () => import("@/views/home/index.vue");

// 设备管理
const DeviceData = () => import("@/views/device/index.vue");
const DeviceDetail = () => import("@/views/device/detail/index.vue");
const DeviceCommand = () => import("@/views/device/command/index.vue");

// 下发记录
const HistoryRecord = () => import("@/views/command/index.vue");
const HistoryParser = () => import("@/views/command/parser/index.vue");

// 综合分析
const Analysis = () => import("@/views/analysis/index.vue");

// 播放内容管理
const PlayContent = () => import("@/views/play/index.vue");

// 报警管理
const Alarm = () => import("@/views/alarm/index.vue");

// 用户管理
const UserList = () => import("@/views/user/index.vue");

// 固件列表
const PackageList = () => import("@/views/package/index.vue");

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
    path: "/404",
    component: Err404,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
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
    path: "/dashboard",
    component: ScreenLayout,
    meta: {
      roles: [1, 2, 3, 4, 5],
    },
    name:'Dashboard',
    children: [
      {
        path: "",
        component: Dashboard,
        name:'dashboard',
        meta: {
          title: "大屏",
          icon: "icon-dapingzhanshi",
          size: "19px",
          affix: true,
          newWindow: true,
          roles: [1, 2, 3, 4, 5],
        },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    name:'Home',
    meta: {
      roles: [1, 2, 3, 4, 5],
    },
    children: [
      {
        path: "home",
        component: Home,
        name:'home',
        meta: {
          title: "首页",
          icon: "icon-ai-home",
          size: "24px",
          affix: true,
          roles: [1, 2, 3, 4, 5],
        },
      },
    ],
  },
  {
    path: "/device",
    component: Layout,
    meta: {
      roles: [1, 4, 5],
    },
    name:'Device',
    children: [
      {
        path: "",
        component: DeviceData,
        name:'device',

        meta: {
          title: "设备管理",
          icon: "icon-a-RTUguanliweixuan",
          size: "19px",
          affix: true,
          roles: [1, 4, 5],
        },
      },
      {
        path: "detail/:type/:id",
        component: DeviceDetail,
        name:'deviceDetail',
        meta: {
          hidden: true,
          activeMenu: "/device",
          roles: [1, 4, 5],
        },
      },
      {
        path: "command/:name/:type/:id",
        component: DeviceCommand,
        name:'deviceCommand',
        meta: {
          hidden: true,
          activeMenu: "/device",
          roles: [1, 4],
        },
      },
    ],
  },

  {
    path: "/command",
    component: Layout,
    meta: {
      roles: [1, 4, 5],
    },
    name:'command',
    children: [
      {
        path: "",
        component: HistoryRecord,
        name:'commandRecord',
        meta: {
          title: "报文记录",
          icon: "icon-xiafajilu",
          size: "19px",
          roles: [1, 4, 5],
        },
      },
      {
        path: "parser/:id/:type",
        component: HistoryParser,
        name:'commandParser',
        meta: {
          hidden: true,
          activeMenu: "/command",
          roles: [1, 4, 5],
        },
      },
    ],
  },
  {
    path: "/alarm",
    component: Layout,
    name:'Alarm',
    meta: {
      roles: [1, 4, 5],
    },
    children: [
      {
        path: "",
        component: Alarm,
        name:'alarm',
        meta: {
          title: "报警管理",
          icon: "icon-nav_icon_bjgl_spe",
          size: "22px",
          roles: [1, 4, 5],
        },
      },
    ],
  },
  {
    path: "/analysis",
    component: Layout,
    name:'Analysis',
    meta: {
      roles: [1, 4, 5],
    },
    children: [
      {
        path: "",
        component: Analysis,
        name:'analysis',
        meta: {
          title: "综合分析",
          icon: "icon-tongjifenxi2",
          size: "21px",
          roles: [1, 4, 5],
        },
      },
    ],
  },
  {
    path: "/play",
    component: Layout,
    name:'Play',
    meta: {
      roles: [1, 4, 5],
    },
    children: [
      {
        path: "",
        component: PlayContent,
        name:'play',
        meta: {
          title: "播放内容管理",
          icon: "icon-guzhangyuyinguanli",
          size: "20px",
          roles: [1, 4, 5],
        },
      },
    ],
  },
  {
    path: "/package",
    component: Layout,
    name:'Package',
    meta: {
      roles: [1, 4, 5],
    },
    children: [
      {
        path: "",
        component: PackageList,
        name:'package',
        meta: {
          title: "固件管理",
          icon: "icon-gujianguanli",
          size: "21px",
          roles: [1, 4, 5],
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    name: "User",
    meta: {
      roles: [1],
    },
    children: [
      {
        path: "",
        component: UserList,
        name: "UserList",
        meta: {
          title: "用户管理",
          icon: "icon-yonghuguanli",
          size: "20px",
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

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  window.location.reload();
  return;
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
  
      if (name && meta.roles?.length) {
        console.log( router.hasRoute(name),'vvvvvvvv')
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload();
  }
}

export default router;
