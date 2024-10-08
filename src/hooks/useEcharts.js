import { ref, markRaw, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";

export function useEchartsHook() {
  const chart = ref(null);
  // 初始化图表
  const initEchart = (ele) => {
    if (ele && !chart.value) {
      chart.value = markRaw(echarts.init(ele));
      window.addEventListener("resize", resizeChart);
    }
  };

  // 设置图表选项
  const setEchartOption = (option) => {
    if (chart.value && option) {
      chart.value.clear();
      chart.value.setOption(option);
      nextTick(() => resizeChart());
    }
  };

  // 地图设置数据
  const setMapData = (area, geoJson) => {
    if (area && geoJson) {
      echarts.registerMap(area, geoJson);
    }
  };

  // 处理图表尺寸调整
  const resizeChart = () => {
    if (chart.value) {
      chart.value.resize({
        animation: {
          duration: 500,
          easing: "cubicInOut",
        },
      });
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
    setMapData,
  };
}
