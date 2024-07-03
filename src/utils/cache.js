/** 统一处理 localStorage */
import cacheKey from "@/constants/cache-key";

// 存储sidebar数据
export const setSideBarLists = (lists) => {
  localStorage.setItem(cacheKey.SIDEBAR_DATA, JSON.stringify(lists));
};
// 获取sidebar数据
export const getSidebarLists = () => {
  return localStorage.getItem(cacheKey.SIDEBAR_DATA);
};

// 存储tags
export const setTagViewsLocal = (lists) => {
  localStorage.setItem(cacheKey.TAGS, JSON.stringify(lists));
};

// 获取tags列表
export const getTagViewsLocal = () => {
  const tagsJson = localStorage.getItem(cacheKey.TAGS);
  return JSON.parse(tagsJson);
};

// 存储主题
export const setThemeName = (name) => {
  localStorage.setItem(cacheKey.THEME_NAME, name);
};

// 获取主题
export const getThemeName = () => {
  return localStorage.getItem(cacheKey.THEME_NAME);
};
