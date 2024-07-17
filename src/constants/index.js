import { markRaw } from "vue";
import RainLevelChart from "@/views/device/components/RainLevelChart.vue";
import MudLevelChart from "@/views/device/components/MudLevelChart.vue";
import { getCssVariableValue } from "@/utils";
import legend1 from "@/assets/images/legend-1.png";
import legend2 from "@/assets/images/legend-2.png";
import legend3 from "@/assets/images/legend-3.png";
const legendColor1 = getCssVariableValue("--legend-bg-color-1");
const legendColor2 = getCssVariableValue("--legend-bg-color-2");
const legendColor3 = getCssVariableValue("--legend-bg-color-3");

// 用户信息
const userRolesMap = [
  { label: "超级管理员", value: 1 },
  { label: "审计管理员", value: 2 },
  { label: "安全管理员", value: 3 },
  { label: "普通账户", value: 4 },
  { label: "只读账户", value: 5 },
];
// 首页卡片数据
const DEVICE_DATA = [
  { field: "total", title: "设备数量（个）", count: 0 },
  { field: "online", title: "在线数量（个）", count: 0 },
  { field: "offline", title: "离线数量（个）", count: 0 },
];

// 首页报文数据
const MESSAGE = [
  {
    title: "Topic rtu/upload/heartbeat/1523453 QoS:0",
    info: "{146183,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-23 10:24:46",
  },
  {
    title: "Topic rtu/upload/heartbeat/3432 QoS:0",
    info: "{2345253233325,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-25 21:33:11",
  },
  {
    title: "Topic rtu/upload/heartbeat/6334 QoS:0",
    info: "{3252352352,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:11",
  },
  {
    title: "Topic rtu/upload/heartbeat/5223 QoS:0",
    info: "{325235236326236236,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:14",
  },
  {
    title: "Topic rtu/upload/heartbeat/66 QoS:0",
    info: "{325326234142152325,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:17",
  },
  {
    title: "Topic rtu/upload/heartbeat/3453445 QoS:0",
    info: "{235326326236,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:19",
  },
  {
    title: "Topic rtu/upload/heartbeat/4646344 QoS:0",
    info: "{53632632634,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:20",
  },
  {
    title: "Topic rtu/upload/heartbeat/634355 QoS:0",
    info: "{2353264757634,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:21",
  },
  {
    title: "Topic rtu/upload/heartbeat/6345646 QoS:0",
    info: "{435242366434,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:23",
  },
  {
    title: "Topic rtu/upload/heartbeat/5354643 QoS:0",
    info: "{235226458,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:24",
  },
  {
    title: "Topic rtu/upload/heartbeat/6363353 QoS:0",
    info: "{24253767422,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:25",
  },
  {
    title: "Topic rtu/upload/heartbeat/63363 QoS:0",
    info: "{215674586,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:26",
  },
  {
    title: "Topic rtu/upload/heartbeat/64363463 QoS:0",
    info: "{23432645762421,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:27",
  },
  {
    title: "Topic rtu/upload/heartbeat/3634634 QoS:0",
    info: "{253475687,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:28",
  },
  {
    title: "Topic rtu/upload/heartbeat/4363463 QoS:0",
    info: "{253755485843,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:29",
  },
  {
    title: "Topic rtu/upload/heartbeat/3525236 QoS:0",
    info: "{236474575,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:30",
  },
  {
    title: "Topic rtu/upload/heartbeat/6364334 QoS:0",
    info: "{23534766532,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:31",
  },
  {
    title: "Topic rtu/upload/heartbeat/6346334 QoS:0",
    info: "{235768564421,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:32",
  },
  {
    title: "Topic rtu/upload/heartbeat/5754352 QoS:0",
    info: "{124263457658,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:33",
  },
  {
    title: "Topic rtu/upload/heartbeat/8656454 QoS:0",
    info: "{1242363635435436436437568723322364366,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:34",
  },
  {
    title: "Topic rtu/upload/heartbeat/45778903 QoS:0",
    info: "{523645865945t34532,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:35",
  },
  {
    title: "Topic rtu/upload/heartbeat/345436 QoS:0",
    info: "{363475867634645345,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:36",
  },
  {
    title: "Topic rtu/upload/heartbeat/23423656 QoS:0",
    info: "{364575876435325,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:37",
  },
  {
    title: "Topic rtu/upload/heartbeat/456421123 QoS:0",
    info: "{3253654768532998,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:38",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
  {
    title: "Topic rtu/upload/heartbeat/5647333 QoS:0",
    info: "{543890053532552353253235,2434,435,332,23,43,43,:1:2:3:4}",
    date: "2024-04-26 04:33:39",
  },
];

//  ------------首页start--------------

// form表单初始值
const initialFormData = { type: "13", station: "", rtu: "", dateTimeRange: [] };

// 感应器类型映射
const SENSOR = {
  6: markRaw(RainLevelChart),
  7: "",
  13: markRaw(MudLevelChart),
};

// 泥位计映射
const WATER_LEVEL = { x: "SJ-1", y: "SJ-2", z: "SJ-3" };
const WATER_LEVEL_LEGEND = {
  x: { icon: legend1, color: legendColor1 },
  y: { icon: legend2, color: legendColor2 },
  z: { icon: legend3, color: legendColor3 },
};

//--------------设备end---------------

//--------------rtu管理start--------------

const projectFormData = { number: "", name: "", type: "" };
const deviceFormItems = [
  {
    label: "设备编号",
    prop: "number",
    attrs: { placeholder: "请输入设备编号" },
    type: "el-input",
  },
  {
    label: "设备名称",
    prop: "name",
    attrs: { placeholder: "请输入设备名称" },
    type: "el-input",
  },
  {
    label: "设备类型",
    prop: "type",
    type: "el-input",
    attrs: { placeholder: "请输入设备类型" },
  }
];

const deviceMap = [
  {label:'泥位计',value:1},
  {label:'雨量计',value:2},
  {label:'断线传感器',value:3},

]

//---------------基础管理end-----------

//---------------用户管理start--------------------

const userFormData = {  user_name: ""};
const userFormItems = [
  {
    label: "用户名",
    prop: "user_name",
    attrs: { placeholder: "请输入用户名" },
    type: "el-input",
  }
];
//---------------用户管理end-----------------


//---------------报文解析start--------------------

const parseFormData = {  text: ""};
const parseFormItems = [
  {
    label: "报文信息",
    prop: "text",
    attrs: { placeholder: "请输入报文信息" },
    type: "el-input",
  }
];
//---------------报文解析end-----------------

export {
  userRolesMap,
  DEVICE_DATA,
  MESSAGE,
  deviceMap,
  WATER_LEVEL,
  SENSOR,
  WATER_LEVEL_LEGEND,
  initialFormData,
  projectFormData,
  deviceFormItems,
  userFormData,
  userFormItems,
  parseFormData,
  parseFormItems
};
