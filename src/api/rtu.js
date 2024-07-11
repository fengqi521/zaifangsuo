import { getRequest, postRequest } from "@/utils/request";
export default {
  // 获取设备数据  {status 0 离线 1在线 2全部}
  getDeviceList: function (params) {
    return getRequest("/v1/device/lists", params);
  },
};
