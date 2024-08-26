<script setup>
import { onMounted, ref, watch, inject, onUnmounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import eventBus from "@/utils/eventBus";
const { initEchart, resizeChart, setEchartOption, updateEchartOption } =
  useEchartsHook();
import { getCssVariableValue } from "@/utils";
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
  initEchart(chartContainer.value);
  setEchartOption(props.option);
});

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
