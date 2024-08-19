<script setup>
import { reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getCommonBar } from "@/utils/chartData";
import { calculatePercentages } from "@/utils";
const screenStore = useScreenStoreHook();
const option = reactive(getCommonBar({ seriesUnit: "%" }));

const resetOptions = (list) => {
  const xData = ["在线", "离线"];
  const { online, offline } = list;
  const onlineCount = online.reduce((prev, next) => prev + next, 0);
  const offlineCount = offline.reduce((prev, next) => prev + next, 0);
  const percentList = calculatePercentages([onlineCount, offlineCount]);
  const yData = [onlineCount, offlineCount];

  option.grid.left = "20%";
  option.grid.right = "20%";
  option.xAxis[0].data = xData;
  option.xAxis[0].axisLine.show = false;
  option.yAxis[0].splitLine.show = false;
  option.yAxis[0].axisLabel.show = false;
  option.tooltip = {
    show: true,
    backgroundColor: "rgba(0,0,0,0.8)",
    formatter: (params) => {
      const { name, dataIndex } = params;
      const str = `<div>${name}：<span>${percentList[dataIndex]}%
        </span></div>`;
      return str;
    },
    textStyle: {
      fontSize: 12,
      color: "#FFF",
    },
  };
  option.series = [
    {
      // 顶部椭圆
      name: "",
      type: "pictorialBar",
      symbolSize: [40, 10],
      symbolOffset: [0, -6],
      symbolPosition: "end",
      z: 12,
      label: {
        show: true,
        position: "top",
        formatter: "{c}个",
        fontSize: 15,
        fontWeight: "bold",
        color: "#1ABEFE",
      },

      itemStyle: {
        color: function (params) {
          const { name } = params;
          if (name === "离线") {
            return "#ccc";
          }
          return "#1ABEFE";
        },
      },
      data: yData,
    },
    {
      name: "",
      type: "pictorialBar",
      symbolSize: [40, 10],
      symbolOffset: [0, 4],
      z: 12,
      itemStyle: {
        color: function (params) {
          const { name } = params;
          if (name === "离线") {
            return "#666";
          }
          return "#323CFF";
        },
      },
      data: yData,
    },

    {
      type: "bar",
      barWidth: "40",
      barGap: "10%",
      barCateGoryGap: "10%",
      itemStyle: {
        color: function (params) {
          const { name } = params;
          if (name === "离线") {
            return {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#ccc", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#333", // 100% 处的颜色
                },
              ],
            };
          }
          return {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#1ABEFE", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#323CFF", // 100% 处的颜色
              },
            ],
          };
        },
        opacity: 0.8,
      },
      data: yData,
    },
  ];
  option.dataZoom[0].show = false;
};

watch(
  () => screenStore.screenData.deviceList,
  (lists) => {
    // if (!lists || !lists.length) return;
    resetOptions(lists);
  },
  { immediate: true }
);
</script>

<template>
  <chart :options="[option]" />
</template>
