import moment from "moment";

/**
 * 获取本机时间
 * @returns
 */
export const getCurrentTime = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
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
  let crc = 0xFFFF; // 初始化 CRC 值为 0xFFFF

  for (let byte of data) {
    crc ^= (byte & 0xFF); // 将当前字节异或到 CRC
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ POLYNOMIAL; // 低位为 1 时，CRC 右移并异或多项式
      } else {
        crc >>= 1; // 低位为 0 时，CRC 仅右移
      }
      crc &= 0xFFFF; // 确保 CRC 值保持在 16 位
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
export const getCRCAsHex=(hexString) =>{
  const byteArray = hexStringToByteArray(hexString);
  const crc = calculateCRC16Modbus(byteArray);
  
  // 将 CRC 值格式化为两位高位字节和两位低位字节
  const highByte = (crc >> 8) & 0xFF;
  const lowByte = crc & 0xFF;
  
  // 格式化为十六进制字符串
  return `${highByte.toString(16).toUpperCase().padStart(2, '0')}${lowByte.toString(16).toUpperCase().padStart(2, '0')}`;
}


