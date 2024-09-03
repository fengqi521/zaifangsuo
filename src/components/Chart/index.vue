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
  isOptionsEmpty(props.option)
  setEchartOption(props.option);
});

const isOptionEmpty = ref(true);
watch(
  () => props.option,
  (newOption) => {
    isOptionsEmpty(newOption);
    setEchartOption(newOption);
  },
  { deep: true }
);

// 计算属性，判断所有 options 的 series 是否为空
const isOptionsEmpty = (option) => {
  isOptionEmpty.value = option.series.every(
    (item) => !item.data || item.data.length === 0
  );
};

defineExpose({ chart });
</script>
<template>
  <el-empty v-if="isOptionEmpty"></el-empty>
  <div
    :class="['chart-container fade', { 'fade-in': !isOptionEmpty }]"
    ref="chartContainer"
  ></div>
</template>
<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  &:last-child {
    margin: 0;
  }
}
.fade {
  opacity: 0;
}

.fade-in {
  opacity: 1;
}
</style>
