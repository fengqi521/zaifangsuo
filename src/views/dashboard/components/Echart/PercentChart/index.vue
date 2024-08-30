<script setup>
import { watch, reactive } from "vue";
import Chart from "@/components/Chart/index.vue";
import Empty from "../../Empty.vue";
import { getCommonPie } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
// 定义 ref 引用和初始化数据
const option = reactive(getCommonPie());

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
        color: "#8a42ff", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(138,66,255,0.6)", // 100% 处的颜色
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
        color: "#24FEB4", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(36,254,180,0.6)", // 100% 处的颜色
      },
    ],
  },
];

watch(
  () => screenStore.screenData.deviceCount,
  (values) => {
    resetOptions(values);
  }
);

const resetOptions = (lists) => {
  lists = lists.map((item, index) => ({ ...item, value: item.count }));
  // 更新饼图数据和样式配置
  const sum = lists.reduce((prev, next) => prev + next.value, 0);
  option.color = colors;
  option.tooltip = {
    ...option.tooltip,
    show:true,
    trigger: "item",
    backgroundColor: "rgba(0,0,0,0.8)",
    // formatter: "{a} <br/>{b}: {c} ({d}%)",
  };
  option.title[0].text = sum;
  option.title.forEach((item) => {
    item.textStyle.color = "#00FFF6";
  });
  option.title[0].top = "40%";
  option.title[1].top = "52%";
  option.legend.orient = "vertical";
  option.legend.textStyle.color = "#FFF";
  option.series = [
    {
      name: "设备数量",
      type: "pie",
      label: {
        show: false,
      },
      radius: ["40%", "90%"],
      center: ["50%", "50%"],
      data: lists,
    },
  ];
};
</script>

<template>
  <Empty v-if="!screenStore.screenData.deviceCount.length" />
  <chart :option="option" v-else />
</template>
