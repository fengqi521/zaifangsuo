import { getRequest, postRequest } from "@/utils/request";
export default {
  // 进行登录
  login: function (data) {
    return postRequest("/v1/login",data);
  },

  // 退出登录
  logout:function(){
    return getRequest('/v1/user/logout')
  }
};
