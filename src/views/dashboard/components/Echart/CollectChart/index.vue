<template>
  <Empty v-if="!screenStore.screenData.monitorData?.data?.timeList?.length" />
  <Chart :option="collectOption" v-else />
</template>

<script setup>
import { reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import Empty from "../../Empty.vue";

import { getCommonLine } from "@/js/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";

const screenStore = useScreenStoreHook();
const collectOption = reactive({});

const resetOptions = (values) => {
  try {
    const { type, data } = values;
    const { timeList, ...others } = data;
    let { valueList } = others;
    switch (type) {
      case 1:
        Object.assign(collectOption, {
          ...getCommonLine({ seriesUnit: ["m"] }),
        });
        collectOption.color = []
        collectOption.grid = {
          ...collectOption.grid,
          left: 0,
          right: 10,
          bottom: 0,
        };

        collectOption.yAxis[0] = {
          ...collectOption.yAxis[0],
          name: "{title|泥水位(m)}",
          nameTextStyle: {
            fontSize: 14,
            color: "#FFF",
            rich: {
              title: { padding: [0, 0, 0, 20] },
            },
          },
          splitLine: { lineStyle: { color: "#2C4756", width: 1 } },
          axisLabel: { color: "#96B4BE", fontSize: 14 },
        };

        const min = Math.min(...valueList);
        const max = Math.max(...valueList);

        collectOption.yAxis[0].min = Number(Math.floor(min).toFixed(2));
        // collectOption.yAxis[0].max = max;

        collectOption.series[0] = {
          name: "泥水位",
          type: "line",
          data: valueList,
          Symbol: "circle",
          smooth: true,
        };
        break;
      case 2:
        Object.assign(collectOption, {
          ...getCommonLine({ seriesUnit: ["m", "m", "min"] }),
        });
        const { rain, duration, total_rain } = others;
        collectOption.grid = {
          ...collectOption.grid,
          left: 0,
          right: 0,
          bottom: 0,
        };
        // 雨量
        collectOption.legend = {
          ...collectOption.legend,
          show: true,
          x: "center",
          data: ["降雨量", "累计降雨量", "降雨时长"],
          itemWidth: 14,
          textStyle: {
            color: "#96B4BE",
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

        collectOption.yAxis[0] = {
          ...collectOption.yAxis[0],
          name: "{title|降雨量(mm)}",
          nameTextStyle: {
            fontSize: 14,
            color: "#FFF",
            rich: {
              title: { padding: [0, 0, 0, 30] },
            },
          },
          splitLine: { lineStyle: { color: "#2C4756", width: 1 } },
          axisLabel: { color: "#96B4BE", fontSize: 14 },
          min: rainMin,
          // max: rainMax,
        };

        const durationMin = Math.min(...duration);
        const durationMax = Math.max(...duration);

        collectOption.yAxis[1] = {
          ...collectOption.yAxis[1],
          name: "{title|降雨时长(min)}",
          nameTextStyle: {
            fontSize: 14,
            color: "#FFF",
            rich: { title: { padding: [0, 40, 0, 0] } },
          },
          min: durationMin,
          max: durationMax,
          splitLine: { show: false },
          axisLabel: { show: true, color: "#96B4BE", fontSize: 14 },
        };

        collectOption.series[0] = {
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
        collectOption.series[1] = {
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
        collectOption.series[2] = {
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
        break;
      case 3:
        Object.assign(collectOption, {
          ...getCommonLine({ seriesUnit: [""] }),
        });
        const colors = ["#e32f46", "#94d96c", "#7049f0"];
        collectOption.grid = {
          ...collectOption.grid,
          left: 0,
          right: 0,
          bottom: 0,
        };
        collectOption.color = colors;
        collectOption.legend = {
          ...collectOption.legend,
          show: true,
          data: valueList.map((item) => item.name),
          textStyle: {
            color: "#FFF",
          },
        };
        collectOption.yAxis[0] = {
          ...collectOption.yAxis[0],
          name: "{title|1代表断开、0代表正常}",
          nameTextStyle: {
            fontSize: 14,
            color: "#FFF",
            rich: {
              title: { padding: [0, 0, 0, 65] },
            },
          },
          splitLine: { lineStyle: { color: "#2C4756", width: 1 } },
          axisLabel: { color: "#96B4BE", fontSize: 14 },
        };

        collectOption.series = valueList.map((item) => ({
          name: `${item.name}`,
          type: "line",
          data: item.valueList,
          Symbol: "circle",
          smooth: true,
        }));
        break;
      default:
        break;
    }
    collectOption.xAxis[0].data = timeList;
    collectOption.xAxis[0].axisLine.lineStyle.color = "#2C4756";
    collectOption.xAxis[0].axisLabel.color = "#96B4BE";
    collectOption.dataZoom[0].show = false;
    console.log(collectOption);
  } catch (error) {
    console.log(error);
  }
};

// 监听数据变化
watch(
  () => screenStore.screenData.monitorData,
  (values) => {
    resetOptions(values);
  }
);
</script>
