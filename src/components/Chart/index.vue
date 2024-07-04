<script setup>
import { onMounted, ref, watch } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
const { initEchart, setEchartOption, updateEchartOption } = useEchartsHook();
import { getCssVariableValue } from "@/utils";
const eleWidth = getCssVariableValue("--bar-width");
const barGap = getCssVariableValue("--bar-gap");
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
});

// 动态设置加载
const setChartItemZoom = () => {
  const _width = chartContainer.value.getBoundingClientRect().width - 32;
  const isShowCount = Math.floor(_width / (Number() + Number(barGap)));
  const total = props.option.series[0].data.length;
  console.log(isShowCount, total);
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
