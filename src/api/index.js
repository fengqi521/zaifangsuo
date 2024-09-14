// 固件包列表
import { getRequest, postRequest } from "@/utils/request";

export default {
  // 登录
  // 获取验证码
  getCaptcha: function () {
    return getRequest("/v1/captcha/create");
  },
  // 进行登录
  login: function (data) {
    return postRequest("/v1/login", data);
  },

  // 退出登录
  logout: function () {
    return getRequest("/v1/user/logout");
  },

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

  // 获取设备数据  {status 0 离线 1在线 2全部}
  getDeviceList: function (params) {
    return getRequest("/v1/device/lists", params);
  },

  // 获取全部设备
  getAllDevice: function (params) {
    return getRequest("/v1/device/option", params);
  },

  // 设备升级
  upgradeDevice: function (params) {
    return postRequest("/v1/upgrade/exec", params);
  },

  // 设备升级
  upgradeStatus: function (params) {
    return getRequest("/v1/upgrade/process", params);
  },

  // 获取设备详情
  getDeviceDetail: function (params) {
    return getRequest("/v1/device/detail", params);
  },

  // 获取设备配置
  getDeviceConfig: function (params) {
    return getRequest("/v1/device/config", params);
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
    return postRequest("/v1/device/control", params);
  },

  // 获取响应数据
  getResponse: function (params) {
    return getRequest("/v1/device/response", params);
  },

  // 下发记录
  getRecord: function (params) {
    return getRequest("/v1/history/lists", params);
  },
  // 下发报文信息
  getReportInfo: function (params) {
    return getRequest("/v1/history/info", params);
  },
  // 解析报文
  getReportParse: function (params) {
    return getRequest("/v1/decode/parse", params);
  },

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

  getPackageList: (params) => {
    return getRequest("/v1/upgrade/packages");
  },
  postPackage: (params, config) => {
    return postRequest("/v1/upgrade/upload", params, config);
  },
  deletePackage: (params) => {
    return postRequest("/v1/upgrade/remove", params);
  },

  // 播放内容
  getAlarmContentList: (params) => {
    return getRequest("/v1/alarm/list", params);
  },
  createAlarm: (params) => {
    return postRequest("/v1/alarm/create", params);
  },
  removeAlarm: (params) => {
    return postRequest("/v1/alarm/remove", params);
  },

  getTemplate: (params) => {
    return getRequest("/v1/alarm/template", params);
  },

  // 报警
  getDownList: (params) => {
    return getRequest("/v1/alarm/down", params);
  },
  getUpList: (params) => {
    return getRequest("/v1/alarm/up", params);
  },

  // 获取天气
  getWeather: (params) => {
    return getRequest("/v1/weather/info", params);
  },
};
