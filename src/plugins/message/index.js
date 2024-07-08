import { ElMessage } from "element-plus";
/**
 * 显示消息提示
 * @param {Object} options - 消息配置
 * @param {string} [options.message=''] - 消息内容
 * @param {string} [options.type='info'] - 消息类型，可选值：'success', 'warning', 'info', 'error'
 * @param {number} [options.duration=3000] - 显示时长，毫秒
 * @param {boolean} [options.showClose=true] - 是否显示关闭按钮
 */
const showMessage = (options = {}) => {
  ElMessage({
    message: options.message || "",
    type: options.type || "info",
    duration: options.duration || 3000,
    showClose: options.showClose !== false,
    ...options,
  });
};

export const useMessage = () => ({
  success: (msg, options = {}) =>
    showMessage({ message: msg, type: "success", ...options }),
  warning: (msg, options = {}) =>
    showMessage({ message: msg, type: "warning", ...options }),
  info: (msg, options = {}) =>
    showMessage({ message: msg, type: "info", ...options }),
  error: (msg, options = {}) =>
    showMessage({ message: msg, type: "error", ...options }),
});

// export const messagePlugin = (app) => {
//   app.use({
//     install(app) {
//       app.config.globalProperties.$message = message;
//     },
//   });
// };
