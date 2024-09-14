<script setup>
import { ref, onMounted, reactive } from "vue";
import systemApi from "@/api";
import Chart from "@/components/Chart/index.vue";
import { getCommonPie } from "@/js/chartData";

// 定义 ref 引用和初始化数据
const percentContainer = ref(null);
const option = reactive({ ...getCommonPie() });

const resetOptions = (data) => {
  var colorList = ["rgb(61, 186, 45)", "rgb(43,166,254)", "rgb(255, 176, 63)"];
  var colorListSub = [
    "rgba(35,143,56,.7)",
    "rgb(43, 166, 254,.88)",
    "rgb(255, 176, 63,.8)",
  ];
  option.title = [];
  option.tooltip.show = false;
  option.legend = {
    ...option.legend,
    orient: "vertical",
    type: "scroll",
    pageIconSize: 8,
  };

  option.series[0] = {
    ...option.series[0],
    center: ["43%", "49%"],
    radius: [0, "62%"],
    data,
    label: {
      formatter: function (params) {
        const { name, value, percent } = params;
        switch (name) {
          case "泥位计":
            return `{a|${name}}\n\n{pera| ${value}个 (${percent}%)}`;
          case "雨量计":
            return `{b|${name}}\n\n{perb| ${value}个 (${percent}%)}`;
          case "断线传感器":
            return `{c|${name}}\n\n{perc| ${value}个 (${percent}%) }`;
        }
      },
      color: "#FFF",
      rich: {
        a: {
          backgroundColor: colorList[0],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },
        pera: {
          backgroundColor: colorListSub[0],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },

        b: {
          backgroundColor: colorList[1],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },
        perb: {
          backgroundColor: colorListSub[1],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },
        c: {
          backgroundColor: colorList[2],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },
        perc: {
          backgroundColor: colorListSub[2],
          fontSize: 12,
          padding: [4,10,2,10],
          height: 16,
          lineHeight: 16,
          align: "center",
          borderRadius: 4,
        },
      },
    },
    labelLine: {
      length2: 30,
    },
  };
};

onMounted(async () => {
  // 更新饼图数据和样式配置
  var color1 = ["rgb(61, 186, 45)", "rgb(43,166,254)", "rgb(255, 176, 63)"];


  let data = [];
  try {
    const result = await systemApi.getDevicePercent();
    if (!result?.code) {
      data = result?.data?.list.map(({ name, count }, index) => ({
        name,
        value: count,
        itemStyle: {
          borderWidth: 4,
          borderColor: color1[index],
          shadowColor: color1[index],
          color: color1[index],
          opacity: 0.8,
        },
      }));
      resetOptions(data)
    }
  } catch (error) {}
});
</script>

<template>
  <div class="device-percent">
    <p class="device-percent__title">设备占比分析</p>
    <div class="device-percent__container">
      <Chart :option="option" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-percent {
  padding-left: 16px;
  &__title {
    line-height: 16px;
    padding-bottom: 16px;
    font-size: 14px;
    color: var(--normal-title-color);
    border-bottom: 1px solid var(--card-border-color);
  }

  &__container {
    width: 100%;
    height: calc(100% - 34px);
  }
}
</style>
