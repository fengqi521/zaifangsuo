<script setup>
import { reactive, watch } from "vue";
import Chart from "../Chart/index.vue";
import { getCommonLine } from "@/js/chartData";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ timeList: [], rain: [], duration: [], total_rain: [] }),
  },
});

const rainOption = reactive({
  ...getCommonLine({
    seriesUnit: ["mm", "mm", "min"],
  }),
});

const resetOptions = (values) => {
  const { timeList, rain, duration, total_rain } = values;
  // 雨量
  rainOption.legend = {
    ...rainOption.legend,
    show: true,
    x: "center",
    data: ["降雨量", "累计降雨量", "降雨时长"],
    itemWidth: 14,
    textStyle: {
      rich: {
        a: {
          verticalAlign: "middle",
        },
      },
      padding: [0, 0, -4, 0],
    },
  };

  const rainMin = Math.min(...rain, ...total_rain);
  const rainMax = Math.max(...rain, ...total_rain);
  rainOption.xAxis[0].data = timeList;
  rainOption.yAxis[0].name = "{title|降雨量(mm)}";
  rainOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 30];
  rainOption.yAxis[0].min = rainMin;
  rainOption.yAxis[0].max = rainMax;

  rainOption.yAxis[1].name = "{title|降雨时长(min)}";
  rainOption.yAxis[1].nameTextStyle.rich.title.padding = [0, 40, 0, 0];

  const durationMin = Math.min(...duration);
  const durationMax = Math.max(...duration);

  rainOption.yAxis[1].min = durationMin;
  rainOption.yAxis[1].max = durationMax;
  rainOption.yAxis[1].splitLine.show = false;

  rainOption.series[0] = {
    name: "降雨量",
    type: "bar",
    data: rain,
    yAxisIndex: 0,
    barWidth: 16,
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#00DB00 ", "#6DFF6D"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };
  rainOption.series[1] = {
    name: "累计降雨量",
    type: "line",
    data: total_rain,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    itemStyle: {
      color: "#FFB200",
    },
  };
  rainOption.series[2] = {
    name: "降雨时长",
    type: "line",
    data: duration,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 1,
    itemStyle: {
      color: "#2450F0",
    },
  };
};

watch(
  () => props.data,
  (values) => {
    resetOptions(values);
  },
  { deep: true, immediate: true }
);
</script>
<template>
  <Chart :option="rainOption"></Chart>
</template>
