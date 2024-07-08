import { ref } from "vue";
import { defineStore } from "pinia";
import loginApi from "@/api/login";
export const userHook = defineStore("user", () => {
  const username = ref("");

  const logout = async () => {
    const result = await loginApi.logout();
    if (!result.code) {
      // 删除token，刷新页面

    }


  };

  return { username,logout };
});
