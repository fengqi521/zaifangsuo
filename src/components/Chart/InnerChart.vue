<script setup>
import { onMounted, ref, watch, inject, onUnmounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import eventBus from "@/utils/eventBus";
const { initEchart, resizeChart, setEchartOption, updateEchartOption } =
  useEchartsHook();
import { getCssVariableValue } from "@/utils";
const eleWidth = getCssVariableValue("--bar-width");
const barGap = getCssVariableValue("--bar-gap");
const names = inject("names");
// 定义变量
const chartContainer = ref(null);
const props = defineProps({
  option: {
    type: Object,
    require: true,
  },
});
onMounted(() => {
  // 初始化echarts
  initEchart(chartContainer.value);
  //   const end = setChartItemZoom();
  //   const option = {
  //     ...props.option,
  //     dataZoom: [{ ...props.option.dataZoom[0], end },{ ...props.option.dataZoom[1], end }],
  //   }
  setEchartOption(props.option);
  if (names?.length) {
    names.forEach((eleName) => {
      eventBus.on(eleName, resizeChart);
    });

    onUnmounted(() => {
      names.forEach((eleName) => {
        eventBus.off(eleName, resizeChart);
      });
    });
  }
});

// 动态设置加载
const setChartItemZoom = () => {
  const _width = chartContainer.value.getBoundingClientRect().width - 32;
  const isShowCount = Math.floor(_width / (Number() + Number(barGap)));
  const total = props.option.series[0].data.length;
  return isShowCount > total ? 100 : (isShowCount / total) * 100;
};
watch(
  () => props.option,
  (newOption, oldOption) => {
    updateEchartOption(newOption);
  },
  { deep: true }
);
</script>
<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>
