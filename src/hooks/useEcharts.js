import { ref, markRaw, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

export function useEchartsHook() {
  const chart = ref(null);

  // 初始化图表
  const initEchart = (ele) => {
    if (ele && !chart.value) {
      chart.value = markRaw(echarts.init(ele));
      // 初始化时调整图表尺寸
      window.removeEventListener("resize", resizeChart);
    }
  };

  // 设置图表选项
  const setEchartOption = (option) => {
    if (chart.value && option) {
      chart.value.setOption(option);
      nextTick(() => {
        resizeChart();
      });
    }
  };

  // 更新图表选项
  const updateEchartOption = (newOption) => {
    if (chart.value) {
      chart.value.clear();
      setEchartOption(newOption);
    }
  };

  // 处理图表尺寸调整
  const resizeChart = () => {
    if (chart.value) {
      chart.value.resize();
    }
  };

  // 清理事件监听器和图表实例
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
    setEchartOption,
    updateEchartOption,
  };
}
