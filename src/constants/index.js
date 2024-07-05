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

//  ------------设备start--------------

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

//--------------基础管理start--------------

// 项目管理
const projectFormData = { id: "", name: "", type: "" };
const projectFormItems = [
  {
    label: "项目ID",
    prop: "id",
    attrs: { placeholder: "请输入项目ID" },
    type: "el-input",
  },
  {
    label: "项目名称",
    prop: "name",
    attrs: { placeholder: "请输入项目名称" },
    type: "el-input",
  },
  {
    label: "项目类型",
    prop: "type",
    type: "el-input",
    attrs: { placeholder: "请输入项目类型" },
  }
];

//---------------基础管理end-----------

// 验证码
const CODE_SRC =
  "data:image/png;base64,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";
export {
  DEVICE_DATA,
  MESSAGE,
  CODE_SRC,
  WATER_LEVEL,
  SENSOR,
  WATER_LEVEL_LEGEND,
  initialFormData,
  projectFormData,
  projectFormItems
};
