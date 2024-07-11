import { getRequest, postRequest } from "@/utils/request";
export default {
  // 用户列表
  getUserList: function (data) {
    return getRequest("/v1/user/lists", data);
  },

  // 获取授权列表
  getAuthList: function () {
    return getRequest("/v1/device/auth");
  },

  // 创建用户
  createUser: function (data) {
    return postRequest("/v1/user/create", data);
  },

  // 删除用户
  deleteUser: function (data) {
    return postRequest("/v1/user/remove", data);
  },

  // 更新用户
  updateUser: function (data) {
    return postRequest("/v1/user/update", data);
  },
};
