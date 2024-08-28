<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonBar } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";

const screenStore = useScreenStoreHook();
// 初始化数据
const option = ref(getCommonBar({ seriesUnit: ["个"] }));

onMounted(() => {
  watch(
    () => screenStore.screenData.deviceList,
    (deviceObj) => {
      resetOptions(deviceObj);
    },
    { immediate: true }
  );
});
const resetOptions = (deviceObj) => {
  const { values, online, offline } = deviceObj;
  option.value.title = [];
  option.value.legend = {
    ...option.value.legend,
    pageIconSize: 8,
    data: ["在线", "离线"],
    show: true,
  };
  option.value.xAxis[0].data = values;
  option.value.yAxis[0].name = "";
  option.value.series = [
    {
      name: "在线",
      type: "bar",
      label: {
        show: false,
        position: "insideRight",
        color: "#000",
      },
      barGap: "35%",
      barCategoryGap: 35,
      data: online,
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
        show: false,
        position: "insideRight",
        color: "#000",
      },
      barGap: "35%",
      barWidth: 20,
      data: offline,
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
};
</script>

<template>
  <chart :option="option" />
</template>

<style lang="scss" scoped></style>
