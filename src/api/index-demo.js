/** 模拟接口响应数据 */
const SIDEBAR_DATA = [
  {
      "id": 9,
      "name": "用户管理",
      "url": "/Sys_User/Manager",
      "parentId": 2,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Import",
          "Export",
          "Upload",
          "Audit"
      ]
  },
  {
      "id": 128,
      "name": "大屏数据",
      "url": "/bigdatapro",
      "parentId": 0,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 94,
      "name": "设备数据",
      "url": "",
      "parentId": 0,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 97,
      "name": "基础管理",
      "url": "",
      "parentId": 0,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 101,
      "name": "统计分析",
      "url": "",
      "parentId": 0,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Import",
          "Export",
          "Upload",
          "Audit"
      ]
  },
  {
      "id": 92,
      "name": "报警日志",
      "url": "/Rdt_error",
      "parentId": 0,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Delete",
          "Update",
          "Export"
      ]
  },
  {
      "id": 2,
      "name": "用户管理",
      "url": "",
      "parentId": 0,
      "icon": "ivu-icon ivu-icon-md-contact",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 64,
      "name": "代码生成",
      "url": "/coding",
      "parentId": 0,
      "icon": "ivu-icon ivu-icon-ios-construct",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 61,
      "name": "系统设置",
      "url": "/",
      "parentId": 0,
      "icon": "ivu-icon ivu-icon-md-settings",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 5,
      "name": "日志管理",
      "url": "/",
      "parentId": 0,
      "icon": "ivu-icon ivu-icon-ios-create",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 38,
      "name": "省市列表",
      "url": "/vProvinceCity",
      "parentId": 15,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Export"
      ]
  },
  {
      "id": 71,
      "name": "权限管理",
      "url": "/permission",
      "parentId": 2,
      "icon": "ivu-icon ivu-icon-ios-boat",
      "enable": 1,
      "permission": [
          "Search",
          "Update"
      ]
  },
  {
      "id": 98,
      "name": "项目管理",
      "url": "/Rdt_projectlist",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Import",
          "Export"
      ]
  },
  {
      "id": 3,
      "name": "角色管理",
      "url": "/Sys_Role/Manager",
      "parentId": 2,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Export"
      ]
  },
  {
      "id": 116,
      "name": "监测站管理",
      "url": "/rdt_monitorlist",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 134,
      "name": "水位计参数设置",
      "url": "/rdt_surfacewater_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 119,
      "name": "RTU管理",
      "url": "/rdt_rtulist",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Import",
          "Export"
      ]
  },
  {
      "id": 135,
      "name": "泥位计参数设置",
      "url": "/rdt_mudpotentionmeter_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 137,
      "name": "土压力参数设置",
      "url": "/rdt_earthpressure_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 138,
      "name": "孔隙水压力参数设置",
      "url": "/rdt_seepagepressure_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 140,
      "name": "静力水准仪参数设置",
      "url": "/rdt_hydrostaticlevel_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 141,
      "name": "拉绳位移计参数设置",
      "url": "/rdt_ropemeter_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 131,
      "name": "传感器管理",
      "url": "/rdt_sensorlist",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 139,
      "name": "地面沉降位移计参数设置",
      "url": "/rdt_crack_para",
      "parentId": 133,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 136,
      "name": "RTU电压",
      "url": "/rtubattery",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 127,
      "name": "语音播报管理",
      "url": "/rdt_rtualarm",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 133,
      "name": "传感器参数管理",
      "url": "",
      "parentId": 97,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 106,
      "name": "土压力",
      "url": "/EarthPressure",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 104,
      "name": "孔隙水压力",
      "url": "/seepagePressure",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 113,
      "name": "地面沉降位移计",
      "url": "/crack",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 105,
      "name": "水位计",
      "url": "WaterLevelIndicater",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 107,
      "name": "土壤含水率",
      "url": "/soidwater",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 108,
      "name": "雨量计",
      "url": "/rainstataion",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 118,
      "name": "数据综合分析",
      "url": "/ALLANALYSIS",
      "parentId": 101,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Import",
          "Export",
          "Upload",
          "Audit"
      ]
  },
  {
      "id": 109,
      "name": "断线传感器",
      "url": "/breakline",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 110,
      "name": "静力水准仪",
      "url": "/hydrostaticlevel",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 111,
      "name": "落石传感器",
      "url": "/rockfall",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 102,
      "name": "设备在线状态统计",
      "url": "/SENSORONLINESTATE",
      "parentId": 101,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Import",
          "Export"
      ]
  },
  {
      "id": 112,
      "name": "GNSS",
      "url": "/GNSS",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 96,
      "name": "次声",
      "url": "/INFRASOUND",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 114,
      "name": "流速仪",
      "url": "/flowmeter",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 103,
      "name": "频发报警数据统计",
      "url": "/sensorerrorstatistic",
      "parentId": 101,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 115,
      "name": "泥位计",
      "url": "/mudpotentiometer",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 65,
      "name": "代码生成",
      "url": "/coder",
      "parentId": 64,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 62,
      "name": "菜单设置",
      "url": "/sysmenu",
      "parentId": 61,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Update"
      ]
  },
  {
      "id": 63,
      "name": "下拉框绑定设置",
      "url": "/Sys_Dictionary",
      "parentId": 61,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Export"
      ]
  },
  {
      "id": 46,
      "name": "产业联盟",
      "url": "/App_Alliance/Manager",
      "parentId": 15,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Export",
          "Audit"
      ]
  },
  {
      "id": 122,
      "name": "拉绳位移计",
      "url": "/Ropemeter",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 123,
      "name": "倾角传感器",
      "url": "/Inclinometer",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 142,
      "name": "气象仪",
      "url": "/meteorograph",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 143,
      "name": "水质传感器",
      "url": "/waterQuality",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 144,
      "name": "地下水温度",
      "url": "/groundwaterTemp",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 145,
      "name": "电磁流量计",
      "url": "eleFlowmeter",
      "parentId": 94,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search"
      ]
  },
  {
      "id": 117,
      "name": "报警日志",
      "url": "/rdt_error",
      "parentId": 92,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update"
      ]
  },
  {
      "id": 47,
      "name": "test2019",
      "url": "/test2019",
      "parentId": 15,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Add",
          "Delete",
          "Update",
          "Export"
      ]
  },
  {
      "id": 6,
      "name": "系统日志",
      "url": "/Sys_Log/Manager",
      "parentId": 5,
      "icon": "",
      "enable": 1,
      "permission": [
          "Search",
          "Delete",
          "Export"
      ]
  }
];

export function getSideData() {
  return new Promise((resolve, reject) => {
    // 模拟接口响应时间 2s
    setTimeout(() => {
      // 模拟接口调用成功
      if (Math.random() < 0.8) {
        resolve(SIDEBAR_DATA);
      } else {
        // 模拟接口调用出错
        reject(new Error("接口发生错误"));
      }
    }, 2000);
  });
}

