<script setup>
import { ref, onMounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import { getCssVariableValue } from "@/utils"
import { getCommonPie } from "@/utils/chartData";
// 引入 ECharts 相关方法和函数
const { initEchart, setEchartOption } = useEchartsHook();

// 定义 ref 引用和初始化数据
const percentContainer = ref(null);
const option = ref(getCommonPie());

// 定义 CSS 变量名
const onlineColor = getCssVariableValue('--chart-pie-online-color');
const offlineColor = getCssVariableValue('--chart-pie-offline-color');


onMounted(() => {
  // 更新饼图数据和样式配置
  option.value.series[0].data = [
    { value: 16, name: "土压力", itemStyle: { color: onlineColor } },
    { value: 10, name: "孔隙水压力", itemStyle: { color: offlineColor } },
    { value: 10, name: "地面沉降位移计", itemStyle: { color: offlineColor } },
    { value: 10, name: "水位计", itemStyle: { color: offlineColor } },
    { value: 10, name: "土壤含水率", itemStyle: { color: offlineColor } },
    { value: 10, name: "雨量计", itemStyle: { color: offlineColor } },
    { value: 10, name: "断线传感器", itemStyle: { color: offlineColor } },
    { value: 10, name: "静力水准仪", itemStyle: { color: offlineColor } },
    { value: 10, name: "落石传感器", itemStyle: { color: offlineColor } },
    { value: 10, name: "GNSS", itemStyle: { color: offlineColor } },
    { value: 10, name: "次声", itemStyle: { color: offlineColor } },
    { value: 10, name: "流速仪", itemStyle: { color: offlineColor } },
    { value: 10, name: "泥位计", itemStyle: { color: offlineColor } },
    { value: 10, name: "拉绳位移计", itemStyle: { color: offlineColor } },
    { value: 10, name: "倾角传感器", itemStyle: { color: offlineColor } },
    { value: 10, name: "气象仪", itemStyle: { color: offlineColor } },
    { value: 10, name: "水质传感器", itemStyle: { color: offlineColor } },
    { value: 10, name: "地下水温度", itemStyle: { color: offlineColor } },
    { value: 10, name: "电磁流量计", itemStyle: { color: offlineColor } },
  ];
  const series = option.value.series[0]
  option.value.title = []
  option.value.legend = { ...option.value.legend, orient: 'vertical', type: 'scroll' }
  series.center = ['40%', '45%']
  // 初始化和设置 echarts 实例
  initEchart(percentContainer.value);
  setEchartOption(option.value);
});
</script>

<template>
  <div ref="percentContainer" class="percent-container"></div>
</template>

<style lang="scss" scoped>
.percent-container {
  width: 100%;
  height: 100%;
}
</style>
