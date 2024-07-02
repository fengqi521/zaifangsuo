/**
 * 判断是否是完整的网络地址
 * @param {string} path 传入的地址
 * @returns {boolean} 是否满足完整网址格式
 */
export const isExternal = (path) => {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(path);
};
