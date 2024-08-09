import { ref, markRaw, onUnmounted } from "vue";
import * as echarts from "echarts";
export function useEchartsHook() {
  const chart = ref(null);
  const initEchart = (ele) => {
    if (ele && !chart.value) {
      chart.value = markRaw(echarts.init(ele));
      window.addEventListener("resize", resizeChart);
    }
  };
  const setEchartOption = (option) => {
    if (chart.value && option) {
      chart.value.setOption(option);
      window.addEventListener("resize", resizeChart);
    }
  };

  const updateEchartOption = (newOption) => {
    if (chart.value) {
      chart.value.clear();
      setEchartOption(newOption);
    }
  };
  const resizeChart = () => {
    if (chart.value) {
      chart.value.resize();
    }
  };

  onUnmounted(() => {
    if (chart.value) {
      window.removeEventListener("resize", resizeChart);
      chart.value.dispose();
      chart.value = null;
    }
  });

  return {
    chart,
    initEchart,
    resizeChart,
    setEchartOption,
    updateEchartOption,
  };
}
