import { getRequest, postRequest } from "@/utils/request";
export default {
  // 用户列表
  getUserList: function (data) {
    return getRequest("/v1/user/lists",data);
  },
};
