<script setup>
import { reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getCommon3dBar } from "@/utils/chartData";
import { calculatePercentages } from "@/utils";
const screenStore = useScreenStoreHook();
const option = reactive(getCommon3dBar({ seriesUnit: "%" }));

const resetOptions = (list) => {

  const { values, data } = list;
  // option.grid.left = "20%";
  // option.grid.right = "20%";
  option.xAxis3D.data = values;
  option.yAxis3D.data = ["在线", "离线"];
  console.log(JSON.stringify(data))
  option.series[0].data = data.map(function (item) {
    return {
      value: item,
    };
  });

  console.log(option)
  // option.tooltip = {
  //   show: true,
  //   backgroundColor: "rgba(0,0,0,0.8)",
  //   formatter: (params) => {
  //     const { name, dataIndex } = params;
  //     const str = `<div>${name}：<span>${percentList[dataIndex]}%
  //       </span></div>`;
  //     return str;
  //   },
  //   textStyle: {
  //     fontSize: 12,
  //     color: "#FFF",
  //   },
  // };
  // option.series[0].data =
  // option.dataZoom[0].show = false;
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
  <chart :option="option" />
</template>
