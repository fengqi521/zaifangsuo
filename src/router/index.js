import { createRouter } from "vue-router";
import { loadComponent, history } from "./helper";

const Layout = () => import("@/layouts/index.vue");
// 登录
const Login = () => import("@/views/login/index.vue");
// 首页
const Home = () => import("@/views/home/index.vue");
const Err404 = () => import("@/views/error-page/404.vue");
const Err401 = () => import("@/views/error-page/401.vue");

// 用户管理
const UserIndex = () => import("@/views/users/user/index.vue");
const UserPermission = () => import("@/views/users/permission/index.vue");
const UserRoles = () => import("@/views/users/roles/index.vue");

const constantRouterMap = [
  {
    path: "/login",
    component: Login,
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/home",
    hidden: true,
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
  },
  // {
  //   path: "/device",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "station",
  //       component: DeviceStation,
  //     },
  //     {
  //       path: "station/detail/:id",
  //       component: StationDetail,
  //     },
  //     {
  //       path: "station/operate/:id",
  //       component: StationOperate,
  //     },
  //     {
  //       path: "station/park/:id",
  //       component: StationPark,
  //     },
  //     {
  //       path: "station/discount/:id",
  //       component: StationDiscount,
  //     },
  //     {
  //       path: "station/add",
  //       component: AddDeviceStation,
  //     },
  //     {
  //       path: "pile",
  //       component: DevicePile,
  //     },
  //     {
  //       path: "pile/add",
  //       component: AddDevicePile,
  //     },
  //     {
  //       path: "pile/detail/:id",
  //       component: PileDetail,
  //     },
  //     {
  //       path: "pile/operate/:id",
  //       component: PileOperate,
  //     },
  //     {
  //       path: "pile/maintain",
  //       component: DeviceMaintain,
  //     },
  //     {
  //       path: "pile/fault",
  //       component: FaultMaintain,
  //     },
  //     {
  //       path: "asset",
  //       component: DeviceAsset,
  //     },
  //     {
  //       path: "asset/enterprise",
  //       component: PileEnterprise,
  //     },
  //     {
  //       path: "charge",
  //       component: ChargeLog,
  //     },
  //     {
  //       path: "ota",
  //       component: OtaManangement,
  //     },
  //     {
  //       path: "ota/update",
  //       component: OtaManageUpdate,
  //     },
  //     {
  //       path: "ota/record",
  //       component: OtaManageRecord,
  //     },
  //   ],
  // },
  // {
  //   path: "/vehicle",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "car",
  //       name: "车辆管理",
  //       component: CarManager,
  //     },
  //     {
  //       path: "car/cartype",
  //       name: "车型管理",
  //       component: CarTypeManager,
  //     },
  //     {
  //       name: "添加车辆",
  //       path: "car/addcar",
  //       component: AddCar,
  //     },
  //     {
  //       name: "品牌管理",
  //       path: "car/carbrand",
  //       component: CarBrand,
  //     },
  //     {
  //       name: "群组管理",
  //       path: "groupmanager",
  //       component: GroupManager,
  //     },
  //     {
  //       name: "添加群组",
  //       path: "groupmanager/addgroup",
  //       component: AddGroup,
  //     },
  //     {
  //       name: "群组详情",
  //       path: "groupmanager/groupdetail",
  //       component: GroupDetail,
  //     },
  //   ],
  // },
  // {
  //   path: "/platform",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "system",
  //       component: PlatSystem,
  //       name: "系统成员",
  //     },
  //     {
  //       path: "system/assign/:id/:account",
  //       component: SystemAuth,
  //       name: "系统成员关联充电站",
  //     },
  //     {
  //       path: "keep",
  //       component: PlatKeep,
  //       name: "运维成员",
  //     },
  //     {
  //       path: "keep/assign/:id/:account",
  //       component: PlatKeepAuth,
  //       name: "运维成员关联充电站",
  //     },
  //     {
  //       path: "owner",
  //       component: PlatOwner,
  //       name: "业主管理",
  //     },
  //     {
  //       path: "owner/add",
  //       component: PlatOwnerEdit,
  //       name: "添加业主",
  //     },
  //     {
  //       path: "owner/edit/:id",
  //       component: PlatOwnerChange,
  //       name: "添加编辑",
  //     },
  //     {
  //       path: "owner/detail/:id",
  //       component: PlatOwnerDetail,
  //       name: "业主详情",
  //     },
  //     {
  //       path: "owner/assign/:id/:account",
  //       component: OwnerAuth,
  //       name: "业主管理",
  //     },
  //     {
  //       path: "agent",
  //       component: PlatAgent,
  //       name: "代理商管理",
  //     },
  //     {
  //       path: "agent/collect/:id",
  //       component: PlatAgentCard,
  //     },
  //     {
  //       path: "agent/add",
  //       component: PlatAgentEdit,
  //       name: "添加代理商",
  //     },
  //     {
  //       path: "agent/edit/:id",
  //       component: PlatAgentEdit,
  //       name: "添加编辑",
  //     },
  //     {
  //       path: "agent/detail/:id",
  //       component: PlatAgentDetail,
  //       name: "代理商详情",
  //     },
  //     {
  //       path: "agent/config/:type/:id",
  //       component: PlatAgentConfig,
  //     },
  //     {
  //       path: "agent/assign/:id/:account",
  //       component: AgentAuth,
  //       name: "代理商管理",
  //     },
  //     {
  //       path: "company",
  //       component: PlatCompany,
  //       name: "企业主管理",
  //     },
  //     {
  //       path: "company/detail/:id",
  //       component: PlatCompanyDetail,
  //       name: "企业主详情",
  //     },
  //     {
  //       path: "role",
  //       component: PlatRole,
  //       name: "角色管理",
  //     },
  //     {
  //       path: "role/add",
  //       component: PlatRoleEdit,
  //       name: "角色管理",
  //     },
  //     {
  //       path: "role/detail/:id",
  //       component: PlatRoleDetail,
  //       name: "角色管理",
  //     },
  //   ],
  // },
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
  // {
  //   path: "*",
  //   redirect: "/404",
  //   hidden: true,
  // },
];
const router = createRouter({
  history,
  routes: constantRouterMap,
});

export default router;
