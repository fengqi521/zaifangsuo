<script setup>
import { watch, reactive } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ timeList: [], valueList: [] }),
  },
});

const collectOption = reactive({ ...getCommonLine({ seriesUnit: [""] }) });
// 图表数据重组
const resetOptions = (values) => {
  const { timeList, valueList } = values;
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = timeList;
  collectOption.yAxis[0].name = "{title|1代表断开、0代表正常}";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 75];
  collectOption.series[0] = {
    name: "断线状态",
    type: "line",
    data: valueList,
    Symbol: "circle",
    smooth: true,
  };
};
watch(
  () => props.data,
  (values) => {
    resetOptions(values);
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <Chart :option="collectOption" />
</template>
