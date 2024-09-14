<template>
  <Empty v-if="!screenStore.screenData.workData.length" />
  <Chart :option="collectOption" v-else />
</template>
<script setup>
import { ref, reactive, watchEffect } from "vue";
import Chart from "@/components/Chart/index.vue";
import Empty from "../../Empty.vue";
import { getCommonLine } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
const collectOption = reactive(getCommonLine({ seriesUnit: ["V", "°C", "dBm"] }));

// 图表数据重组
const resetOptions = (lists) => {
  collectOption.color = ["#ff0000", "rgba(255,148,84,1)", "#FFFF00"];
  collectOption.legend = {
    ...collectOption.legend,
    data: ["电压", "温度", "信号强度"],
    show: true,
    x: 80,
    textStyle: {
      color: "#96b4be",
      rich: {
        a: {
          verticalAlign: "middle",
        },
      },
      padding: [0, 0, -2, 0],
    },
  };
  collectOption.grid.bottom = 0;
  collectOption.grid.top = 30;
  collectOption.grid.right = 35;
  collectOption.xAxis[0].data = lists[0].timeList;
  collectOption.xAxis[0].axisLine.lineStyle.color = "#2C4756";
  collectOption.xAxis[0].axisLabel.color = "#96B4BE";

  collectOption.yAxis[0].name = "{title|电压(V)}";

  collectOption.yAxis[1].name = "{title|温度(°C)}";
  collectOption.yAxis[0].nameTextStyle.fontSize = 14;
  collectOption.yAxis[0].nameTextStyle.color = "#FFF";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 5, 0, 0];

  collectOption.yAxis[0].splitLine = {
    lineStyle: {
      color: "#2C4756",
      width: 1,
    },
  };
  collectOption.yAxis[0].axisLabel = {
    color: "#96B4BE",
    fontSize: 14,
  };

  collectOption.yAxis[1].nameTextStyle.rich.title.padding = [-10, 0, 0, 0];
  collectOption.yAxis[1].nameTextStyle.color = "#FFF";

  collectOption.yAxis[1].splitLine = {
    lineStyle: {
      color: "#2C4756",
      width: 1,
    },
  };
  collectOption.yAxis[1].axisLabel = {
    color: "#96B4BE",
    fontSize: 14,
  };

  collectOption.yAxis[2] = {
    ...collectOption.yAxis[1],
    name: "{title|信号强度(dBm)}",
    nameTextStyle: {
      rich: {
        title: {
          padding: [0, 0, 0, 0],
        },
      },
      color: "#FFF",
    },
    offset: 60,
  };

  collectOption.series = lists.map((item, index) => {
    collectOption.yAxis[index].min = Math.min(...item.valueList);
    collectOption.yAxis[index].max = Math.max(...item.valueList);
    if(index>0){
      collectOption.yAxis[index].splitLine.show = false;
    }

    return {
      name: item.name,
      type: "line",
      data: item.valueList,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: index,
      // areaStyle: {
      //   color: colors[index],
      // },
    };
  });
  collectOption.dataZoom[0].show = false;
};
// 监听数据变化
watchEffect(() => {
  const lists = screenStore.screenData.workData;
  if (!lists || !lists.length) return;
  resetOptions(lists);
});
</script>
