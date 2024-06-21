import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentTime } from "@/utils/index";
export function useCurrentDate(interval = 1000) {
  // 使用 ref 来存储日期
  const currentDate = ref("");

  // 创建一个函数来更新日期
  const updateDate = () => {
    currentDate.value = getCurrentTime();
  };

  // 当组件挂载时开始计时
  onMounted(() => {
    updateDate();
    const intervalId = setInterval(updateDate, interval);
    // 当组件卸载时清理计时器
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  });

  return {
    currentDate,
  };
}
