import { markRaw } from "vue";
// import RainLevelChart from "@/views/device/components/RainLevelChart.vue";
// import MudLevelChart from "@/views/device/components/MudLevelChart.vue";
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

];

const allOperateType = [
  { label: "遥测站定时报", value: 0 },
  { label: "遥测站加报报", value: 1 },
  { label: "心跳", value: 2 },
  { label: "查询遥测站实时数据", value: 3 },
  { label: "查询遥测站时段数据", value: 4 },
  { label: "修改遥测站配置", value: 5 },
  { label: "读取遥测站配置", value: 6 },
  { label: "设置遥测站时钟", value: 7 },
  { label: "读取遥测站时钟", value: 8 },
  { label: "查询遥测站实时位置", value: 9 },
  { label: "遥测站复位", value: 10 },
  { label: "上报自检数据", value: 11 },
  { label: "查询实时自检数据", value: 12 },
];
const messageFormData = { category: 13 };
const messageFormItems = [
  {
    label: "",
    prop: "category",
    attrs: { placeholder: "请选择报文类型" },
    type: "el-select",
    options: [{ label: "全部", value: 13 },...allOperateType],
  },
  
];

//  ------------首页start--------------

// form表单初始值
const initialFormData = { type: "13", station: "", rtu: "", dateTimeRange: [] };

// 感应器类型映射
// const SENSOR = {
//   6: markRaw(RainLevelChart),
//   7: "",
//   13: markRaw(MudLevelChart),
// };

// 泥位计映射
const WATER_LEVEL = { x: "SJ-1", y: "SJ-2", z: "SJ-3" };
const WATER_LEVEL_LEGEND = {
  x: { icon: legend1, color: legendColor1 },
  y: { icon: legend2, color: legendColor2 },
  z: { icon: legend3, color: legendColor3 },
};
//--------------rtu管理start--------------

const operateLists = [
  {
    label: "中心站查询遥测站实时数据",
    type: "37",
    code: 3,
  },
  {
    label: "中心站查询遥测站时段数据",
    type: "38",
    code: 4,
  },
  {
    label: "中心站修改遥测站配置表",
    type: "40",
    code: 5,
  },
  {
    label: "中心站读取遥测站配置表",
    type: "41",
    code: 6,
  },
  {
    label: "中心站设置遥测站时钟",
    type: "4A",
    code: 7,
  },
  {
    label: "中心站读取遥测站时钟",
    type: "51",
    code: 8,
  },
  {
    label: "中心站查询遥测站实时位置",
    type: "52",
    code: 9,
  },
  {
    label: "遥测站软件复位",
    type: "E0",
    code: 10,
  },
  // {
  //   label: "遥测站上报自检数据",
  //   type: "E1",
  // },
  {
    label: "中心站查询遥测站实时自检数据",
    type: "E2",
    code: 12,
  },
];

const projectFormData = {
  device_number: "",
  device_name: "",
  device_type: 0,
  status: "2",
};
const deviceFormItems = [
  {
    label: "设备编号",
    prop: "device_number",
    attrs: { placeholder: "请输入设备编号" },
    type: "el-input",
  },
  {
    label: "设备名称",
    prop: "device_name",
    attrs: { placeholder: "请输入设备名称" },
    type: "el-input",
  },
  {
    label: "设备类型",
    prop: "device_type",
    type: "el-select",
    attrs: { placeholder: "请输入设备类型" },
    options: [
      { label: "全部", value: 0 },
      { label: "泥位计", value: 1 },
      { label: "雨量计", value: 2 },
      { label: "断线传感器", value: 3 },
    ],
  },
  {
    label: "设备状态",
    prop: "status",
    type: "el-select",
    attrs: { placeholder: "请选择设备状态" },
    options: [
      { label: "全部", value: "2" },
      { label: "在线", value: "1" },
      { label: "离线", value: "0" },
    ],
  },
];

const deviceMap = [
  { label: "泥位计", value: 1 },
  { label: "雨量计", value: 2 },
  { label: "断线传感器", value: 3 },
];

//---------------用户管理start--------------------

const userFormData = { user_name: "" };
const userFormItems = [
  {
    label: "用户名",
    prop: "user_name",
    attrs: { placeholder: "请输入用户名" },
    type: "el-input",
  },
];

//---------------报文解析start--------------------

const parseFormData = { code: "" };
const parseFormItems = [
  {
    label: "报文信息",
    prop: "code",
    attrs: { placeholder: "请输入报文信息" },
    type: "el-input",
  },
];

//---------------------报文记录----------------
const recordFormData = {
  Category: 14,
  Transfer: "",
  Did: "",
  range: [],
}; // transfer 1是上行报文解析
const recordOptions = [...allOperateType,  { label: "自定义", value: 13 }]
const recordFormItems = [
  {
    label: "操作类型",
    prop: "Category",
    attrs: { placeholder: "请选择操作类型" },
    type: "el-select",
    options: [{ label: "全部", value: 14 }, ...recordOptions],
  },
  {
    label: "传输类型",
    prop: "Transfer",
    attrs: { placeholder: "请选择传输类型" },
    type: "el-select",
    options: [
      { label: "上行", value: 1 },
      { label: "下行", value: 2 },
    ],
  },
  {
    label: "设备名称",
    prop: "Did",
    attrs: { placeholder: "请选择设备" },
    type: "el-select",
    options: [],
  },

  {
    label: "时间范围",
    prop: "range",
    type: "el-date-picker",
    attrs: {
      type: "datetimerange",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      // format: "yyyy-MM-dd HH:mm:ss", // 你可以根据需要自定义格式
      valueFormat: "YYYY-MM-DD HH:mm:ss", // 数据格式
    },
  },
];
//---------------功能码对应关系 start--------------------

export {
  userRolesMap,
  DEVICE_DATA,
  MESSAGE,
  deviceMap,
  WATER_LEVEL,
  WATER_LEVEL_LEGEND,
  initialFormData,
  projectFormData,
  deviceFormItems,
  userFormData,
  userFormItems,
  parseFormData,
  parseFormItems,
  operateLists,
  messageFormData,
  messageFormItems,
  recordFormData,
  recordFormItems,
  recordOptions
};
