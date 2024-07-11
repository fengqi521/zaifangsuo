<script setup>
import { onMounted, reactive, inject } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";
// 泥水位
const collectOption = reactive(
  getCommonLine({ seriesUnit: "m", yAxisTitlePadding: [0, 0, 0, 10] })
);
const data = inject("mudLevelData");
onMounted(() => {
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.yAxis[0].name = "{title|泥水位(m)}";
  collectOption.series[0] = {
    name: "泥水位",
    type: "line",
    data: data.valueList,
    Symbol: "circle",
    // symbolSize: 6,
    smooth: true,
    unit: "m",
  };
});
</script>
<template>
  <Chart :options="[collectOption]" />
</template>
<style lang="scss" scoped>
.chart-container {
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 360px;
  border: 1px solid var(--normal-border-color);
  &:last-child {
    margin: 0;
  }
}
</style>
