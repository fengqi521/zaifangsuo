function setInputValue(value, decimals,min, max) {
  if(!value) return ''
  const numericValue = parseFloat(value);
  if(numericValue>=max) return max;
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
    if (min !== undefined && numericValue < min) {
      value = min.toString();
    }
    if (max !== undefined && numericValue > max) {
      value = max.toString();
    }
  }

  return value;
}
export function useInputHook() {
  return { setInputValue };
}
