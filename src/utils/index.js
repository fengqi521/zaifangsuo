import moment from "moment";
import "moment/dist/locale/zh-cn";
moment.locale("zh-cn");
/**
 * 获取本机时间
 * @returns
 */
export const getCurrentTime = (format) => {
  return moment().format(format || "YYYY-MM-DD HH:mm:ss");
};

/**
 * 获取不同时间的开始结束时间
 * @param  {String} type 时间类型
 * @returns {Array}  [开始时间,结束时间]
 */
export const getStartAndEndTime = (type) => {
  const start = moment().startOf(type).format("YYYY-MM-DD HH:mm:ss");
  const end = moment().endOf(type).format("YYYY-MM-DD HH:mm:ss");
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
 * @param {*} contentLength  内容长度
 * @returns 版本号及长度
 */
export const encodeMessage = (version, contentLength) => {
  // 提取协议版本号（高 4 位）
  const ver = (version & 0x0f) << 12;
  // 提取报文正文内容长度（低 12 位）
  const length = contentLength & 0x0fff;
  // 组合版本号和长度为 16 位的值
  const encodedValue = ver | length;
  // 将 16 位的值转换为 2 字节的十六进制字符串
  return encodedValue.toString(16).toUpperCase().padStart(4, "0");
};

// CRC-16/MODBUS 校验码计算
function calculateCRC16Modbus(data) {
  const POLYNOMIAL = 0x8005; // CRC-16/MODBUS 多项式
  let crc = 0xffff; // 初始化 CRC 值为 0xFFFF

  for (let byte of data) {
    crc ^= byte & 0xff; // 将当前字节异或到 CRC
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ POLYNOMIAL; // 低位为 1 时，CRC 右移并异或多项式
      } else {
        crc >>= 1; // 低位为 0 时，CRC 仅右移
      }
      crc &= 0xffff; // 确保 CRC 值保持在 16 位
    }
  }

  return crc;
}

// 将十六进制字符串转换为字节数组
function hexStringToByteArray(hexString) {
  let byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substr(i, 2), 16));
  }
  return byteArray;
}

// 计算给定数据的 CRC 校验码并转换为十六进制字符串
export const getCRCAsHex = (hexString) => {
  const byteArray = hexStringToByteArray(hexString);
  const crc = calculateCRC16Modbus(byteArray);

  // 将 CRC 值格式化为两位高位字节和两位低位字节
  const highByte = (crc >> 8) & 0xff;
  const lowByte = crc & 0xff;

  // 格式化为十六进制字符串
  return `${highByte.toString(16).toUpperCase().padStart(2, "0")}${lowByte
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}`;
};

/**
 * 十进制转十六进制
 * @param {*} timeString 时间{时：分}
 * @param {*} width 保留位数
 * @returns   十六进制值
 */
export const strToHex = (str, width = 2) => {
  // 解析字符串
  const strArr = str.split(":").map(Number);
  const hexArr = strArr.map((num) =>
    num.toString(16).toUpperCase().padStart(width, "0")
  ); // 转换为十六进制并确保至少两位

  // 根据数组长度返回相应的结果
  return hexArr.length > 1 ? hexArr.join("") : hexArr[0];
};

/**
 * 十六进制转十进制
 * @param {*} hexStr 16进制
 * @returns   十进制值
 */
export const hexToDecimal = (hexStr) => {
  // 确保输入是大写，避免解析时的错误
  hexStr = hexStr.toUpperCase();
  
  // 将十六进制字符串转换为十进制整数
  const decimal = parseInt(hexStr, 16);
  
  // 返回结果
  return decimal.toString();
};

/**
 * 计算在线和离线数量的占比，并确保总和为100%
 * @param {Array<number>}  values  各项数据数组
 * @returns  {Array<number>} - 包含每项调整后的百分比
 */
export const calculatePercentages = (values) => {
  // 计算总数
  const total = values.reduce((sum, value) => sum + value, 0);

  // 计算每项的初步占比
  const percentages = values.map((value) => ((value / total) * 100).toFixed(2));

  // 计算总的百分比之和
  const totalPercent = percentages
    .reduce((sum, percent) => sum + parseFloat(percent), 0)
    .toFixed(2);

  // 计算调整值
  const adjustment = (100 - totalPercent).toFixed(2);

  // 调整第一个百分比，确保总和为100%
  const adjustedPercentages = percentages.map((percent, index) => {
    if (index === 0) {
      return (parseFloat(percent) + parseFloat(adjustment)).toFixed(2);
    }
    return percent;
  });

  return adjustedPercentages;
};

/**
 * 计算文件大小
 * @param {*} bytes 字节
 * @returns 文件大小
 */
export const formatSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

/**
 * 计算设备是否在线
 * @param {string} timeString 时间
 * @returns {boolean} 是否在线
 */
export const isOnLine = (timeString) => {
  if (!timeString) return false;
  let currentTime = getCurrentTime();
  const minute = moment(currentTime).diff(moment(timeString), "minute");
  return minute < 5;
};
