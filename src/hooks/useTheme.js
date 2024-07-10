import { ref, watchEffect } from "vue";
import { setThemeName, getThemeName } from "@/utils/cache/localStorage";

const DEFAULT_THEME_NAME = "normal";
/** 主题列表 */
const themeList = [
  {
    title: "默认",
    name: DEFAULT_THEME_NAME,
  },
  {
    title: "黑暗",
    name: "dark",
  },
  {
    title: "深蓝",
    name: "dark-blue",
  },
];

/** 正在应用的主题名称 */
const currentThemeName = ref(getThemeName() || DEFAULT_THEME_NAME);

/** 设置主题 */
const setTheme = (value) => {
  currentThemeName.value = value;
};

/** 在 html 根元素上挂载 class */
const setHtmlRootClassName = (value) => {
  document.documentElement.className = value;
};

/** 初始化 */
const initTheme = () => {
  watchEffect(() => {
    const value = currentThemeName.value;
    setHtmlRootClassName(value);
    setThemeName(value);
  });
};

/** 主题 hook */
export function useThemeHook() {
  return { themeList, currentThemeName, initTheme, setTheme };
}
