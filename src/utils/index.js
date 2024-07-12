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
