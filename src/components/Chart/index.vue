<script setup>
import { onMounted, ref, watch } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
const { chart, initEchart, setEchartOption } = useEchartsHook();
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

defineExpose({ chart })
watch(
  () => props.option,
  (newOption) => {
    setEchartOption(newOption);
  },
  { deep: true }
);
</script>
<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>
<style lang="scss" scoped>
.chart-container {
  padding: 16px;
  width: 100%;
  border: 1px solid var(--card-border-color);

  &:last-child {
    margin: 0;
  }
}
</style>