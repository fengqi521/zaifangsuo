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
];

export { DEVICE_DATA, MESSAGE };
