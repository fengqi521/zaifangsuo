import { ref, onMounted, onUnmounted } from "vue";
import { userInfoStoreHook } from "@/store/modules/user";
import { useMessage } from "@/plugins/message";
export const useTimeoutHook = (timeoutDuration = 15, debounceDelay = 100) => {
  const timer = ref(null);

  // 清除当前定时器
  const resetTimer = () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
  };

  // 防抖函数
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // 初始化定时器
  const startTimeout = () => {
    resetTimer();
    timer.value = setTimeout(() => {
      const { warning } = useMessage();
      const userInfoStore = userInfoStoreHook();
      warning(`您已超过${timeoutDuration}分钟未进行操作，即将自动退出系统`);
      userInfoStore.logout().then(() => {
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      });
    }, timeoutDuration * 1000);
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
