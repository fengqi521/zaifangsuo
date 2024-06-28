import { ref,onUnmounted  } from "vue";
import * as echarts from "echarts";
export function useEchartsHook() {
  const chart = ref(null);
  const initEchart = (ele) => {
    if (ele) chart.value = echarts.init(ele);
  };

  const setEchartOption = (option) => {
    if (chart.value) {
      chart.value.setOption(option);
      window.addEventListener("resize", chart.value.resize);
      onUnmounted(() => {
        window.removeEventListener("resize", chart.value.resize);
      });
    }
  };

  return { initEchart, setEchartOption };
}
