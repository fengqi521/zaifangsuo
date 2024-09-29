export default {
  /**
   * 密码长度最小8位，包含数字、字母、特殊字符的组合
   * @param {string} value   需要验证的密码字符串
   * @returns   {boolean} 显示密码是否符合要求
   */
  validatePassword: (rule, value, callback) => {
    const reg =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!reg.test(value)) {
      return callback(new Error("密码至少8位，且包含数字、字母和特殊字符"));
    }
    return callback();
  },
  /**
   * 判断是否为手机号（1 开头）
   * @param {string} value   需要验证的手机号
   * @returns   {boolean} 手机号格式是否正确
   */
  validatePhoneNumber: (rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (!reg.test(value)) {
      return callback(new Error("手机号格式错误"));
    }
    return callback();
  },

  validateTime: (rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    const inputTime = new Date(value.replace(/-/g, '/')).getTime();
    const now = new Date().getTime();
    if (inputTime < now) {
      return callback(new Error("选择的时间不能小于当前时间"));
    }

    return callback();
  }
};