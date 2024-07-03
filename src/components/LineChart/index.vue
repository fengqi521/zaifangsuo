<script setup>
import { onMounted, ref, watch } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
const { initEchart, setEchartOption, updateEchartOption } = useEchartsHook();

// 定义变量
const lineContainer = ref(null);
const props = defineProps({
  option: {
    type: Object,
    require: true,
  },
});

onMounted(() => {
  // 初始化echarts
  initEchart(lineContainer.value);
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
  <div class="chart-container" ref="lineContainer"></div>
</template>
