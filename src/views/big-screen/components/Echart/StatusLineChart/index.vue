<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonBar } from "@/utils/chartData";

// 初始化数据
const option = ref(getCommonBar({seriesUnit:['个']}));

onMounted(async () => {
  // {name:'泥位计',online:0,offline:2},
  // {name:'雨量计',online:0,offline:1},
  const value = ["泥位计", "雨量计"];
  option.value.title = [];
  option.value.legend = {
    ...option.value.legend,
    pageIconSize: 8,
    data: ["在线", "离线"],
    show: true,
  };
  option.value.xAxis[0].data = value;
  option.value.yAxis[0].name = "";
  option.value.series = [
    {
      name: "在线",
      type: "bar",
      label: {
        normal: {
          show: false,
          position: "insideRight",
          textStyle: {
            color: "#000",
          },
        },
      },
      barGap: "35%",
      barCategoryGap: 35,
      data: [0, 0],
      barWidth: 20,
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: ["#00FFF6", "#008DD2"].map((color, offset) => ({
            color,
            offset,
          })),
        },
      },
    },
    {
      name: "离线",
      type: "bar",
      label: {
        normal: {
          show: false,
          position: "insideRight",
          textStyle: {
            color: "#000",
          },
        },
      },
      barGap: "35%",
      barWidth: 20,
      data: [2, 1],
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: ["#FF9454", "#FF78B5"].map((color, offset) => ({
            color,
            offset,
          })),
        },
      },
    },
  ];

  option.value.dataZoom[0].show = false;
});
</script>

<template>
  <chart :options="[option]" />
</template>

<style lang="scss" scoped></style>
