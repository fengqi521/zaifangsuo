import { ref } from "vue";
import axios from "axios";
import { get, merge } from "lodash";
import { removeUserCookie } from "@/utils/cache/cookie";
import { useMessage } from "@/plugins/message";
const { warning} = useMessage();

/** 删除cookie并强制刷新页面（会重定向到登录页） */
function logout() {
  removeUserCookie();
  window.location.reload();
}

const requestStatus = ref(false);
/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      // config.headers = {
      //   "Content-Type": "application/x-www-form-urlencoded",
      // };
      // if(config.url.indexOf('upload')>-1){
      //   config.headers = {
      //     "Content-Type": "multipart/form-data",
      //   };
      // }

      return config;
    },
    // 发送失败
    (error) => Promise.reject(error)
  );
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      const data = response.data;
      const code = data.code;
      if (requestStatus.value) return data;

      switch (code) {
        case 406:
          requestStatus.value = true;
          logout();
          break;
        default:
          break;
      }
      return data;
      // // 二进制数据则直接返回
      // const responseType = response.request?.responseType;
      // if (responseType === "blob" || responseType === "arraybuffer")
      //   return apiData;
      // // 这个 code 是和后端约定的业务 code
      // const code = apiData.code;
      // // 如果没有 code, 代表这不是项目后端开发的 api
      // if (code === undefined) {
      //   ElMessage.error("非本系统的接口");
      //   return Promise.reject(new Error("非本系统的接口"));
      // }
      // switch (code) {
      //   case 0:
      //     // 本系统采用 code === 0 来表示没有业务错误
      //     return apiData;
      //   case 401:
      //     // Token 过期时
      //     return logout();
      //   default:
      //     // 不是正确的 code
      //     ElMessage.error(apiData.message || "Error");
      //     return Promise.reject(new Error("Error"));
      // }
    },
    (error) => {
      // status 是 HTTP 状态码
      console.log(error);
      const status = get(error, "response.status");
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          // Token 过期时
          logout();
          break;
        case 302:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求地址出错";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP 版本不受支持";
          break;
        default:
          break;
      }
      // ElMessage.error(error.message);
      return Promise.reject(error);
    }
  );
  return service;
}

/** 创建请求方法 */
function createRequest(service) {
  return function (config) {
    // const token = getToken()
    const defaultConfig = {
      // headers: {
      // 携带 Token
      // Authorization: token ? `Bearer ${token}` : undefined,
      // "Content-Type": "application/json",
      // },
      timeout: 120000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {},
    };
    // 合并配置 mergeConfig
    const mergeConfig = merge(defaultConfig, config);
    return service(mergeConfig);
  };
}

/** 用于网络请求的实例 */
const service = createService();

/** 用于网络请求的方法 */
const request = createRequest(service);

/** 封装 POST 请求方法 */
function postRequest(url, data = {}, config = {}) {
  return request({
    ...config,
    url,
    method: "post",
    data,
  });
}

// /** 封装 GET 请求方法 */
function getRequest(url, params = {}, config = {}) {
  return request({
    ...config,
    url,
    method: "get",
    params,
  });
}

export { getRequest, postRequest };
