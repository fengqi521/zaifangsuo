<script setup>
import { onMounted, watch, reactive } from "vue";
import "echarts-gl";
import Chart from "@/components/Chart/index.vue";
import { getCommon3dBar, getCommonBar } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";

const screenStore = useScreenStoreHook();
// 初始化数据
const option = reactive({ ...getCommon3dBar() });

onMounted(() => {
  watch(
    () => screenStore.screenData.deviceList,
    (deviceObj) => {
      resetOptions(deviceObj);
    },
    { immediate: true,deep:true}
  );
});
const resetOptions = (deviceObj) => {
  const { values, status, data } = deviceObj;
  option.xAxis3D.data = values;
  option.yAxis3D.data = status.map((item, index) => ({
    value: item,
    textStyle: { color: !index ? "#d73027" : "#20d180" },
  }));
  option.series[0].data = data.map((item, index) => ({
    value: item,
    itemStyle: {
      color: !(index % 2) ? "#d73027" : "#20d180",
      opacity: 0.7,
    },
  }));
};
</script>

<template>
  <chart :option="option" />
</template>

<style lang="scss" scoped></style>
