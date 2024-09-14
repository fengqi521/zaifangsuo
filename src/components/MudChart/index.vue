<script setup>
import { watch, reactive } from "vue";
import Chart from "../Chart/index.vue";
import { getCommonLine } from "@/js/chartData";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ timeList: [], valueList: [] }),
  },
});

const collectOption = reactive({
  ...getCommonLine({ seriesUnit: ["m"], yAxisTitlePadding: [0, 0, 0, 10] }),
});

// 图表数据重组
const resetOptions = (values) => {
  const { timeList, valueList } = values;
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = timeList;
  collectOption.yAxis[0].name = "{title|泥水位(m)}";
  collectOption.yAxis[1].show = false;

  const min = Math.min(...valueList);
  const max = Math.max(...valueList);

  collectOption.yAxis[0].min = min;
  collectOption.yAxis[0].max = max;

  collectOption.series[0] = {
    name: "泥水位",
    type: "line",
    data: valueList,
    Symbol: "circle",
    smooth: true,
  };
};

// 监听数据变化
watch(
  () => props.data,
  (values) => {
    resetOptions(values);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <Chart :option="collectOption" />
</template>
