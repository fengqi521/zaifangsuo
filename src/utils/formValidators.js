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
    const inputTime = new Date(value.replace(/-/g, "/")).getTime();
    const now = new Date().getTime();
    if (inputTime < now) {
      return callback(new Error("选择的时间不能小于当前时间"));
    }

    return callback();
  },

  channelValidator: (type, channelTypes) => {
    return (rule, value, callback) => {
      const list = channelTypes.find((item) => item.code === type);
      // 类型为0 禁用

      // ip地址类型
      if (list?.type === 1) {
        if (!value) {
          callback(new Error("IP地址不能为空"));
        } else {
          const arr = value.split(".");
          const flag = arr.some((item) => !item);
          if (flag) callback(new Error("IP地址格式错误"));
        }
      }

      // 北斗卡号类型
      if (list?.type === 2) {
        if (!value) {
          callback(new Error("北斗卡号不能为空"));
        } else {
          const flag = value.length > 8 || parseFloat(value) > 16777215;
          if (flag) callback(new Error("北斗卡号错误，输入小于16777215的值"));
        }
      }

      // 物联网卡号
      if (list?.type === 3) {
        if (!value) {
          callback(new Error("北斗卡号不能为空"));
        } else {
          const flag = value.length !== 13;
          if (flag) callback(new Error("物联网号错误，输入13位有效数字"));
        }
      }

      callback();
    };
  },

  validateAlarmPhone: (rule, value, callback) => {
    const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (!reg.test(value)) {
      return callback(new Error("告警短信号格式错误"));
    }
    return callback();
  },
};
