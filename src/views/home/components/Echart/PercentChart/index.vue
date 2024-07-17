<script setup>
import { ref, onMounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import homeApi from "@/api/home";
import { getCssVariableValue } from "@/utils";
import { getCommonPie } from "@/utils/chartData";
// 引入 ECharts 相关方法和函数
const { initEchart, setEchartOption } = useEchartsHook();

// 定义 ref 引用和初始化数据
const percentContainer = ref(null);
const option = ref(getCommonPie());

// 定义 CSS 变量名
const onlineColor = getCssVariableValue("--online-bg-color");
const offlineColor = getCssVariableValue("-chart-pie-offline-color");
const nameColor = getCssVariableValue("--panel-active-color");
const totalColor = getCssVariableValue("--chart-total-color");
const percentColor = getCssVariableValue("--chart-percent-color");

onMounted(async () => {
  // 更新饼图数据和样式配置
  try {
    const result = await homeApi.getDevicePercent();
    if (!result?.code) {
      option.value.series[0].data = result?.data?.list.map(
        ({ name, count }) => ({ name, value: count })
      );
    }
  } catch (error) {}

  // option.value.series[0].data = [
  //   { value: 16, name: "土压力" },
  //   { value: 1, name: "孔隙水压力" },
  //   { value: 1, name: "地面沉降位移计" },
  //   { value: 1, name: "水位计" },
  //   { value: 1, name: "土壤含水率" },
  //   { value: 1, name: "雨量计" },
  //   { value: 1, name: "断线传感器" },
  //   { value: 1, name: "静力水准仪" },
  //   { value: 1, name: "落石传感器" },
  //   { value: 1, name: "GNSS" },
  //   { value: 1, name: "次声" },
  //   { value: 1, name: "流速仪" },
  //   { value: 1, name: "泥位计" },
  //   { value: 1, name: "拉绳位移计" },
  //   { value: 1, name: "倾角传感器" },
  //   { value: 1, name: "气象仪" },
  //   { value: 1, name: "水质传感器" },
  //   { value: 1, name: "地下水温度" },
  //   { value: 1, name: "电磁流量计" },
  // ];

  option.value.title = [];
  option.value.tooltip.show = false;
  option.value.legend = {
    ...option.value.legend,
    orient: "vertical",
    type: "scroll",
    pageIconSize: 8,
  };
  const series = option.value.series[0];
  series.center = ["43%", "49%"];
  series.itemStyle.borderRadius = 0;
  series.itemStyle.borderWidth = 0;
  series.radius = [0, "62%"];
  series.label = {
    show: true,
    formatter: function (params) {
      const { name, value, percent } = params;
      return `{name|${name}}\n{hr|}\n{value|数量: ${value}个}\n{rate|占比: ${percent}%}`;
    },
    backgroundColor: "#F6F8FC",
    borderColor: "#8C8D8E",
    borderWidth: 1,
    borderRadius: 4,
    rich: {
      name: {
        color: nameColor,
        fontSize: 12,
        lineHeight: 20,
        padding: 4,
        align: "center",
        fontWeight: "bold",
      },
      hr: {
        borderColor: "#8C8D8E",
        width: "100%",
        borderWidth: 1,
        height: 0,
      },
      value: {
        padding: 4,
        fontSize: 12,
        color: totalColor,
        lineHeight: 28,
        align: "left",
      },
      rate: {
        padding: 4,
        fontSize: 12,
        color: percentColor,
        lineHeight: 18,
        align: "left",
      },
    },
  };
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
