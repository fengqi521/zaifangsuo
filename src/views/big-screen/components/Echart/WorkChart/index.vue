<template>
  <Chart :options="[collectOption]" />
</template>
<script setup>
import { ref, reactive, watchEffect } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";
const collectOption = reactive(
  getCommonLine({ seriesUnit: ["V", "°C"], yAxisTitlePadding: [0, 0, 0, 80] })
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
  valueList: [23, 19, 35, 5, 0, 0, 0],
  valueList2: [16, 11, 6, 9, 15, 14, 7],
};
// 图表数据重组
const resetOptions = () => {
  // collectOption.color = colors;
  collectOption.grid.bottom = 0;
  collectOption.grid.top = 30;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.xAxis[0].axisLine.lineStyle.color = "#2C4756";
  collectOption.xAxis[0].axisLabel.color = "#96B4BE";
  collectOption.yAxis[0].name = "{title|电压(V)}";
  collectOption.yAxis[1].name = "{title|温度(V)}";
  collectOption.yAxis[0].nameTextStyle.fontSize = 14;
  collectOption.yAxis[0].nameTextStyle.color = "#FFF";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 10];
  collectOption.yAxis[1].nameTextStyle.rich.title.padding = [100, 0, 0, 0];
  collectOption.yAxis[1].nameTextStyle.color = "#FFF";
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

  collectOption.yAxis[1].splitLine = {
    lineStyle: {
      color: "#2C4756",
      width: 1,
    },
  };
  collectOption.yAxis[1].axisLabel = {
    color: "#96B4BE",
    fontSize: 14,
  };
  collectOption.series = [
    {
      name: "电压",
      type: "line",
      data: data.valueList,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: 0,
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
              color: "rgba(255,115,63,0.3)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(247,80,100,0.8)", // 100% 处的颜色
            },
          ],
        },
      },
    },
    {
      name: "温度",
      type: "line",
      data: data.valueList2,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: 1,
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
              color:"rgba(255,148,84,0.3)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(252,194,4,0.8)", // 100% 处的颜色
            },
          ],
        },
      },
    },
  ];
  collectOption.dataZoom[0].show = false;
  console.log(collectOption);
};
resetOptions();
// 监听数据变化
watchEffect(() => {
  //   resetOptions(chartData);
});
</script>
