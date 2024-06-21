/** 统一处理 localStorage */
import CacheKey from "@/constants/cache-key";

// 存储sidebar数据
export const setSideBarLists = (lists) => {
  localStorage.setItem(CacheKey.SIDEBAR_DATA, JSON.stringify(lists));
};
// 获取sidebar数据
export const getSidebarLists = () => {
  return localStorage.getItem(CacheKey.SIDEBAR_DATA);
};

// 存储tags
export const setTagViewsLocal = (lists)=>{
  localStorage.setItem(CacheKey.TAGS,JSON.stringify(lists))
}

export const getTagViewsLocal = ()=>{
  const tagsJson = localStorage.getItem(CacheKey.TAGS)
  return JSON.parse(tagsJson)
}
