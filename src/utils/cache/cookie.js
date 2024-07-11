/** 统一处理 Cookie */

import CacheKey from "@/constants/cache-key";
import Cookies from "js-cookie";

export const setUserCookie = (info) => {
  Cookies.set(CacheKey.USER_INFO, JSON.stringify(info));
};
export const getUserCookie = () => {
  const jsonInfo = Cookies.get(CacheKey.USER_INFO);
  return jsonInfo ? JSON.parse(jsonInfo) : {};
};

export const removeUserCookie = () => {
  Cookies.remove(CacheKey.USER_INFO);
};
