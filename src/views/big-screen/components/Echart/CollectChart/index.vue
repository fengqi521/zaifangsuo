<template>
  <Chart :options="[collectOption]" />
</template>
<script setup>
import { ref, reactive, watchEffect } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";
const collectOption = reactive(
  getCommonLine({ seriesUnit: ["m"], yAxisTitlePadding: [0, 0, 0, 80] })
);
// const props =
const data = {
  timeList: [
    "2024-08-07 16:12:49",
    "2024-08-07 16:17:39",
    "2024-08-07 16:22:39",
    "2024-08-07 16:27:39",
    "2024-08-07 16:32:39",
    "2024-08-07 16:37:39",
    "2024-08-07 16:42:39",
  ],
  valueList: [2, 3, 1, 5, 0, 0, 0],
};
// 图表数据重组
const resetOptions = () => {
  // collectOption.color = colors;
  collectOption.grid.bottom = 0;
  collectOption.grid.top = 30;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.xAxis[0].axisLine.lineStyle.color = "#2C4756";
  collectOption.xAxis[0].axisLabel.color = "#96B4BE";
  collectOption.yAxis[0].name = "{title|泥水位(m)}";
  collectOption.yAxis[0].nameTextStyle.fontSize = 14;
  collectOption.yAxis[0].nameTextStyle.color = "#FFF";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0,0,0,20]
  collectOption.yAxis[0].splitLine = {
    lineStyle: {
      color: "#2C4756",
      width: 1,
    },
  };
  collectOption.yAxis[0].axisLabel = {
    color: "#96B4BE",
    fontSize: 14,
  };

  collectOption.series[0] = {
    name: "泥水位",
    type: "line",
    data: data.valueList,
    Symbol: "circle",
    smooth: true,
    unit: "m",
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "#8B69FF", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "#00ABD5", // 100% 处的颜色
          },
        ],
      },
    },
  };
  collectOption.dataZoom[0].show = false;
  console.log(collectOption);
};
resetOptions();
// 监听数据变化
watchEffect(() => {
  //   resetOptions(chartData);
});
</script>
