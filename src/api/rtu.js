import { getRequest, postRequest } from "@/utils/request";
export default {
  // 获取设备数据  {status 0 离线 1在线 2全部}
  getDeviceList: function (params) {
    return getRequest("/v1/device/lists", params);
  },

  // 获取设备详情
  getDeviceDetail: function (params) {
    return getRequest("/v1/device/detail", params);
  },

  // 获取雨量数据
  getRainData: function (params) {
    return postRequest("/v1/device/history", params);
  },

  // 获取雨量分页数据
  getRainHistory: function (params) {
    return postRequest("/v1/device/historyByPage", params);
  },

  // 获取设备工况数据
  getWorkData: function (params) {
    return postRequest("/v1/device/work", params);
  },

    // 获取设备工况分页数据
    getWorkHistory: function (params) {
      return postRequest("/v1/device/workByPage", params);
    },

  // 命令下发
  downControl: function (params) {
    return getRequest("/v1/device/control", params);
  },

  // 获取响应数据
  getResponse: function (params) {
    return getRequest("/v1/device/response", params);
  },
};
