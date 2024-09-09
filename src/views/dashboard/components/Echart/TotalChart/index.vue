<script setup>
import { reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getCommonBar } from "@/utils/chartData";
const screenStore = useScreenStoreHook();
const option = reactive(getCommonBar({ seriesUnit: "个" }));

const resetOptions = (list) => {
  const { values, online, offline } = list;
  option.legend.data = ["在线", "离线"];
  option.grid.top = 0;
  option.xAxis[0].type = "value";
  option.xAxis[0].axisLabel.show = false;
  option.xAxis[0].axisLine.show = false;

  option.yAxis[0].type = "category";
  option.yAxis[0].data = values;
  option.yAxis[0].splitLine.show = false;
  option.yAxis[0].axisLabel.interval = 0;
  option.yAxis[0].inverse = true;
  option.tooltip.axisPointer = {
    type: "shadow",
  };

  option.series = [
    {
      type: "bar",
      name: "在线",
      barWidth: 12,
      stack: "总量",
      zlevel: 2,
      itemStyle: {
        barBorderRadius: 10,
        color: {
          colorStops: [
            {
              offset: 0,
              color: "#abe7ab", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#68d568", // 100% 处的颜色
            },
          ],
        },
        opacity: 0.8,
      },
      data: online,
    },
    {
      type: "bar",
      barWidth: 12,
      zlevel: 2,
      name: "离线",
      stack: "总量",
      itemStyle: {
        barBorderRadius:10,
        color: {
          colorStops: [
            {
              offset: 0,
              color: "#ff9ca2", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#ff4b55", // 100% 处的颜色
            },
          ],
          opacity: 0.8,
        },
      },
      data: offline,
    },
  ];
  option.dataZoom = [];
};

watch(
  () => screenStore.screenData.area,
  (lists) => {
    // if (!lists || !lists.length) return;
    resetOptions(lists);
  },
  { immediate: true }
);
</script>

<template>
  <div class="total-chart">
    <Empty v-if="!screenStore.screenData.area.length" />
    <chart :option="option" v-else/>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.total-chart {
  height: calc(100% - 38px);
  overflow-y: hidden;
  overflow-x: hidden;
  &:hover {
    overflow-y: auto;
  }
  @extend %scrollbar;
  :deep(.chart-container) {
    height: 600px !important;
  }
}
</style>
