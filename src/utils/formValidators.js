export default {
  /**
   * 密码长度最小8位，包含数字、字母、特殊字符的组合
   * @param {string} password   需要验证的密码字符串
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
};
