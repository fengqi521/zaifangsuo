import { createWebHashHistory, createWebHistory } from "vue-router";
export const history =
  import.meta.env.VITE_ROUTER_HISTORY === "hash"
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH);

export const loadComponent = async (path) => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  if (isProduction) {
    return () => import(/* @vite-ignore */ `${path}`); // 懒加载
  } else {
    const modules = import.meta.globEager(`${path}`);
    if (path in modules) {
      return modules[path].default;
    } else {
      throw new Error(`Component at path "${path}" not found`);
    }
  }
};
