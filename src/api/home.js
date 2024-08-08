import { getRequest, postRequest } from "@/utils/request";
import _ from "lodash";
export default {
  // 设备数量
  getDeviceNumber: function () {
    return getRequest("/v1/device/number");
  },

  // 设备数量占比
  getDevicePercent: function () {
    return getRequest("/v1/device/category");
  },

  // 获取实时数据
  getHistory: function (params) {
    return getRequest("/v1/history/realtime", params);
  },


};
