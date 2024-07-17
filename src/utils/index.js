import moment from "moment";

/**
 * 获取本机时间
 * @returns
 */
export const getCurrentTime = () => {
  return moment().format("YYYY-MM-DD hh:mm:ss");
};

/**
 * 获取不同时间的开始结束时间
 * @param  {String} type 时间类型
 * @returns {Array}  [开始时间,结束时间]
 */
export const getStartAndEndTime = (type) => {
  const start = moment().startOf(type).format();
  const end = moment().endOf(type).format();
  return [start, end];
};

/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName) => {
  let cssVariableValue = "";
  try {
    cssVariableValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue(cssVariableName);
  } catch (error) {
    console.error(error);
  }
  return cssVariableValue;
};


/**
 * 组合计算报文版本号及长度
 * @param {*} version 版本号
 * @param {*} length  长度
 * @returns 版本号及长度
 */
export const  encodeMessage=(version, length)=> {
  // 版本号必须在 0 到 15 之间
  if (version < 1 || version > 15) {
    throw new Error("Version must be between 0 and 15");
  }

  // 报文正文长度必须在 0 到 4095 之间
  if (length < 1 || length > 4095) {
    throw new Error("Length must be between 0 and 4095");
  }

  // 组合版本号和报文正文长度
  const combined = (version << 12) | length;

  // 转换为 4 位十六进制字符串
  const hexStr = combined.toString(16).toUpperCase().padStart(4, '0');
  return hexStr;
}
