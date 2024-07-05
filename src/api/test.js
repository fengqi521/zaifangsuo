import {get} from '@/utils/service'
export default {
  // 获取当前登录用户的可分配余额
  getMenu: function () {
    return get("/v1/hello");
  },
};
