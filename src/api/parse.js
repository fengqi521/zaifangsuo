import { getRequest, postRequest } from "@/utils/request";
export default {
  // 解析报文
  getParse: function (params) {
    return getRequest("/v1/parse", params);
  },
};
