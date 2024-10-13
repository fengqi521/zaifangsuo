function setInputValue(value, decimals, min, max) {
  if (!value) return "";
  
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "";
  if (numericValue >= max) return max;
  // 处理输入值
  value = value
    // 移除非数字和小数点字符
    .replace(/[^\d.]/g, "")
    // 只保留第一个小数点
    .replace(/(\..*)\./g, "$1")
    // 如果需要保留小数位
    .replace(new RegExp(`^(\\-?\\d+)(\\.\\d{0,${decimals}}).*`, "g"), "$1$2")
    // 移除开头的小数点（如有）
    .replace(/^\./, "");

  // 处理整数
  if (decimals === 0) {
    value = Math.floor(parseFloat(value)).toString();
  }

  // 处理最小值和最大值限制
  if (!isNaN(numericValue)) {
    const numericStr = numericValue.toString();
  
    // 验证不允许无效格式
    if (!(/^0{2,}$/.test(numericStr) || /^0\.0+$/.test(numericStr))) {
      if (min !== undefined && numericValue < min) {
        value = min.toString();
      }
      if (max !== undefined && numericValue > max) {
        value = max.toString();
      }
    } else {
      value = ""; // 输入无效，设为默认值
    }
  }
  return value;
}

function setInputMaxLen(value, length) {
  if (!value) return "";
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "";

  // 只允许输入数字
  const numberValue = value.replace(/\D/g, "");

  // 限制长度为最大位
  if (numberValue.length > length) {
    return numberValue.slice(0, length);
  } else {
    return numberValue;
  }
}

let prevValue;
function setInputExactDivision(value) {
  if (!value) return "";
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "";

  // 只允许输入数字
  const numberValue = value.replace(/\D/g, "");

  // 检查是否能被24整除
  if (24 % numberValue === 0) {
    prevValue = numberValue;
    return numberValue;
  } else {
    // 如果不能被24整除，则还原为原值
    return prevValue;
  }
}
export function useInputHook() {
  return { setInputValue, setInputMaxLen, setInputExactDivision };
}
