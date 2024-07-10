import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import loginApi from "@/api/login";
import { setUserCookie, removeUserCookie } from "@/utils/cache/cookie";
export const userInfoStoreHook = defineStore("user", () => {
  const userInfo = reactive({ name: "", role: "", uid: "" });

  // 登录
  const login = async ({ username = "", password = "", captcha = "" }) => {
    const result = await loginApi.login({ username, password, captcha });
    if (!result?.code) {
      const info = {
        name: result.data.user_name,
        uid: result.data.id,
        role: result.data.role,
      };
      setUserCookie(info);
      Object.assign(userInfo, info);
    }
  };

  // 退出登录
  const logout = async () => {
    const result = await loginApi.logout();
    if (!result.code) {
      removeUserCookie();
      Object.assign(userInfo, { name: "", role: "", uid: "" });
    }
  };

  return { userInfo, login, logout };
});
