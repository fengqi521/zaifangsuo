/** 统一处理 Cookie */

import CacheKey from "@/constants/cache-key";
import Cookies from "js-cookie";

export const setUserCookie = (info) => {
  Cookies.set(CacheKey.USER_INFO, info);
};
export const getUserCookie = () => {
  return Cookies.get(CacheKey.USER_INFO);
};

export const removeUserCookie = () => {
  Cookies.remove(CacheKey.USER_INFO);
};
