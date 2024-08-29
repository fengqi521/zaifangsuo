import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentTime } from "@/utils/index";
export function useCurrentDate(interval = 1000) {
  // 使用 ref 来存储日期
  const currentDate = ref("");

  //HH:mm
  const hourMinutes = ref("");

  // 星期
  const weekday = ref("");

  // 年月日
  const day = ref("");

  // 创建一个函数来更新日期
  const updateDate = () => {
    currentDate.value = getCurrentTime();
  };

  // 实时获取当前完整时间
  onMounted(() => {
    updateDate();
    const intervalId = setInterval(updateDate, interval);
    // 当组件卸载时清理计时器
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  });

  // 获取当前时间HH:mm
  const getHourMinutes = () => {
    hourMinutes.value = getCurrentTime("HH:mm:ss");
  };
  // 获取星期
  const getWeek = () => {
    weekday.value = getCurrentTime("dddd");
  };

  // 获取日期
  const getCurrentDay = () => {
    day.value = getCurrentTime("YYYY.MM.DD");
  };

  return {
    currentDate,
    hourMinutes,
    weekday,
    day,
    getHourMinutes,
    getWeek,
    getCurrentDay,
  };
}
