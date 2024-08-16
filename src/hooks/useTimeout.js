import { ref, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash";
import { userInfoStoreHook } from "@/store/modules/user";
import { useMessage } from "@/plugins/message";
export const useTimeoutHook = (timeoutDuration = 30, debounceDelay = 100) => {
  const timer = ref(null);

  // 清除当前定时器
  const resetTimer = () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
  };

  // 初始化定时器
  const startTimeout = () => {
    resetTimer();
    timer.value = setTimeout(() => {
      const { warning } = useMessage();
      const userInfoStore = userInfoStoreHook();
      warning(`您已超过${timeoutDuration}分钟未进行操作，即将自动退出系统`);
      setTimeout(() => {
        userInfoStore.logout();
      }, 3000);
    }, timeoutDuration * 60 * 1000);
  };

  // 在组件挂载时设置定时器
  onMounted(() => {
    startTimeout();
    ["mousemove", "keydown"].forEach((event) => {
      document.addEventListener(event, debounce(startTimeout, debounceDelay));
    });
  });

  // 在组件卸载时清除事件监听器
  onUnmounted(() => {
    ["mousemove", "keydown"].forEach((event) => {
      document.removeEventListener(
        event,
        debounce(startTimeout, debounceDelay)
      );
    });
    resetTimer();
  });
};
