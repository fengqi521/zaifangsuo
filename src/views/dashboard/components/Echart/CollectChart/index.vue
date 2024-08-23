<template>
  <Empty v-if="!screenStore.screenData.monitorData.length" />
  <Chart :options="[collectOption]" v-else />
</template>

<script setup>
import { reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import Empty from "../../Empty.vue";

import { getCommonLine } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";

const screenStore = useScreenStoreHook();
const collectOption = reactive({});

// 初始化图表选项

const colors = [
  {
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
// 更新yAxis
const updateYAxis = (type) => {
  const titles = {
    1: "泥水位(m)",
    2: "雨量(mm)",
    3: "1代表断开、0代表正常",
  };
  collectOption.yAxis[1].show = false;
  console.log(collectOption,'vvvvvvvvvv')
  const yAxisOptions = {
    name: `{title|${titles[type] || ""}}`,
    nameTextStyle: {
      fontSize: 14,
      color: "#FFF",
      rich: {
        title: { padding: [0, 0, 0, 20] },
      },
    },
    splitLine: { lineStyle: { color: "#2C4756", width: 1 } },
    axisLabel: { color: "#96B4BE", fontSize: 14 },
  };

  collectOption.yAxis[0] = yAxisOptions;

  if (type === 2) {
    collectOption.yAxis[1] = {
      ...collectOption.yAxis[1],
      show: true,
      name: `{title|降雨时长(min)}`,
      alignTicks:true,
      nameTextStyle: {
        fontSize: 14,
        color: "#FFF",
        rich: { title: { padding: [0, 30, 0, 0] } },
      },
      splitLine: { lineStyle: { color: "#2C4756", width: 1 } },
      axisLabel: { show: true, color: "#96B4BE", fontSize: 14 },
    };
  }

  if (type === 3) {
    collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 60];
  }
};

// 更新series
const updateSeries = (type, lists) => {
  const item = lists[0];
  collectOption.series = {
    name: item.name,
    type: "line",
    data: item.valueList,
    symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: colors[0],
    },
  };

  if (type === 2) {
    collectOption.series = lists.map((item, index) => ({
      name: item.name,
      type: index > 0 ? "line" : "bar",
      data: item.valueList,
      symbol: "circle",
      smooth: true,
      yAxisIndex: index % 2,
      areaStyle: {
        color: colors[index],
      },
    }));
  }
};

const resetOptions = (lists) => {
  Object.assign(
    collectOption,
    getCommonLine({ seriesUnit: ["m", "min", "m"] })
  );
  const type = screenStore.screenData.type;
  lists = lists.slice(0, 3);
  collectOption.color = colors;
  
  collectOption.grid.bottom = 0;
  collectOption.grid.top = 30;

  collectOption.xAxis[0].data = lists[0].timeList;
  collectOption.xAxis[0].axisLine.lineStyle.color = "#2C4756";
  collectOption.xAxis[0].axisLabel.color = "#96B4BE";
  if (type === 2) {
    collectOption.legend = {
      ...collectOption.legend,
      x: "center",
      show: true,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        fontSize: 12,
        lineHeight: 14,
        color: "#96B4BE",
        rich: {
          a: {
            verticalAlign: "middle",
          },
        },
        padding: [0, 0, -2, 0],
      },
      data: lists.map((item, index) => {
        if (!index) {
          return { icon: "rect", name: item.name };
        }
        return { icon: "circle", name: item.name };
      }),
    };
  }

  if (type === 3) {
    collectOption.tooltip.formatter = (params) => {
      let res = "";
      let formatterName = "";
      params.forEach((current) => {
        let { name, color, value, seriesName, seriesIndex } = current;
        formatterName = `<span style='display:block;font-weight:bold'>${name}</span>`;
        res +=
          `<div style="display:flex;align-items:center;justify-content:space-between;padding:2px 0"><div><span style="display:inline-block;vertical-align:middle;margin-right:6px;margin-bottom:4px;border-radius:6px;` +
          `width:6px;height:6px;background-color:${color};"></span>${seriesName}状态:</div><span>${value}</span></div>`;
      });
      return formatterName + res;
    };
  }

  updateYAxis(type);
  updateSeries(type, lists);

  collectOption.dataZoom[0].show = false;
};

// 监听数据变化
watch(
  () => screenStore.screenData.monitorData,
  (values) => {
    if (values && values.length) {
      resetOptions(values);
    }
  }
);
</script>
