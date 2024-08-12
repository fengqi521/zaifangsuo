<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonPie } from "@/utils/chartData";
import { color } from "echarts";

// 定义 ref 引用和初始化数据
const option = ref(getCommonPie());

var echartData = [
  {
    value: 2,
    name: "泥位计",
  },
  {
    value: 1,
    name: "雨量计",
  },
];
const scale = 0.8;
var rich = {
  yellow: {
    color: "#FF9454",
    fontSize: 30 * scale,
    // padding: [2, 2],
    align: "center",
  },
  white: {
    color: "#fff",
    align: "center",
    fontSize: 14 * scale,
    padding: [12, 0],
  },
  blue: {
    color: "#49dff0",
    fontSize: 16 * scale,
    align: "center",
  },
  hr: {
    borderColor: "#0b5263",
    width: "100%",
    borderWidth: 1,
    height: 0,
  },
};

var colors = [
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#323CFF", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "#1ABEFE", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#5CFFCD", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "#00ABD5", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#FF9454", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "#fcc204", // 100% 处的颜色
      },
    ],
  },
];
onMounted(async () => {
  // 更新饼图数据和样式配置
  const sum = echartData.reduce((prev, next) => prev + next.value, 0);
  option.value.color = colors;
  option.value.title[0].text = sum;
  option.value.title.forEach((item) => {
    item.textStyle.color = "#00FFF6";
  });
  option.value.title[0].top = "40%";
  option.value.title[1].top = "52%";
  option.value.legend.orient = "vertical";
  option.value.legend.textStyle.color = "#FFF";
  option.value.series = [
    {
      name: "设备总数",
      type: "pie",
      label: {
        normal: {
          formatter: function (params, ticket, callback) {
            var total = 0;
            var percent = 0;
            echartData.forEach(function (value, index, array) {
              total += value.value;
            });
            percent = ((params.value / total) * 100).toFixed(1);
            return (
              "{white|" +
              params.name +
              "}\n{yellow|" +
              params.value +
              "}\n{blue|" +
              percent +
              "%}"
            );
          },
          rich: rich,
        },
      },
      radius: ["40%", "90%"],
      center: ["50%", "50%"],
      roseType: "area",
      data: echartData,
    },
  ];
});
</script>

<template>
  <chart :options="[option]" />
</template>
