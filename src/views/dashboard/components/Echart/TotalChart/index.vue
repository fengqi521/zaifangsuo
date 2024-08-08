<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/Chart/index.vue"
import { getCommonPie } from "@/utils/chartData";
// 定义 ref 引用和初始化数据
const dataContainer = ref(null);
const option = ref(getCommonPie());

// 定义 CSS 变量名
const onlineColor = getCssVariableValue("--online-bg-color");
const offlineColor = getCssVariableValue("--chart-pie-offline-color");

onMounted(async () => {
  // 更新饼图数据和样式配置
  option.value.series[0].data = [
    {
      value: res?.data?.online,
      name: "在线",
      itemStyle: { color: onlineColor },
    },
    {
      value: res?.data?.offline,
      name: "离线",
      itemStyle: { color: offlineColor },
    },
  ];

  const values = Object.values(res?.data);
  const sum = values.reduce((prev, val) => prev + val, 0);
  option.value.title[0].text = sum;

  option.value.series[0].radius = ["45%", "65%"];
});
</script>

<template>
  <chart :options="[option]" />
</template>
