<script setup>
import { ref, onMounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import { getCssVariableValue } from "@/utils"
import { getCommonPie } from "@/utils/chartData";
// 引入 ECharts 相关方法和函数
const { initEchart, setEchartOption } = useEchartsHook();

// 定义 ref 引用和初始化数据
const dataContainer = ref(null);
const option = ref(getCommonPie());

// 定义 CSS 变量名
const onlineColor = getCssVariableValue('--chart-pie-online-color');
const offlineColor = getCssVariableValue('--chart-pie-offline-color');

onMounted(() => {
  // 更新饼图数据和样式配置
  option.value.series[0].data = [
    { value: 16, name: "在线", itemStyle: { color: onlineColor } },
    { value: 10, name: "离线", itemStyle: { color: offlineColor } },
  ];
  option.value.title[0].text = '26'
  option.value.series[0].radius= ["45%", "65%"],
  // 初始化和设置 echarts 实例
  initEchart(dataContainer.value);
  setEchartOption(option.value);
});
</script>

<template>
  <div ref="dataContainer" class="data-container"></div>
</template>

<style lang="scss" scoped>
.data-container {
  width: 100%;
  height:100%;
  padding-right: 16px;
  border-right: 2px dashed #F0F0F0;
}
</style>
