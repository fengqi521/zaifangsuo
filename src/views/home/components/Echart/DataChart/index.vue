<script setup>
import { ref, onMounted, reactive } from "vue";
import systemApi from "@/api";
import Chart from "@/components/Chart/index.vue";
import { getCssVariableValue } from "@/utils";
import { getCommonPie } from "@/js/chartData";

// 定义 ref 引用和初始化数据
const option = reactive({ ...getCommonPie() });

const resetOptions = (values, sum) => {
  option.legend.data = ["在线", "离线"];
  values = values.flatMap((item) => [item, { name: "", value: 0 }]);
  option.title[0].text = sum;
  option.series = [
    {
      animation: false,
      type: "pie",
      radius: ["55%", "68%"],
      data: [0],
      color: ["gray"],
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
    },
    {
      name: "设备状态",
      type: "pie",
      radius: ["48%", "70%"],
      label: {
        formatter: (params) => {
          const { name, value } = params;
          if (!name) return;
          return `{b|${name}}数(个)\n{c|${value}}`;
        },
        lineHeight: 16,
        rich: {
          c: {
            fontSize: 18,
            fontWeight: "bold",
            color: getCssVariableValue("--chart-pie-value-color"),
          },
        },
      },
      data: values,
      itemStyle: {
        color: function (params) {
          var colorList = [
            {
              colorStops: [
                {
                  offset: 0,
                  color: "#3c38e4",
                },
                {
                  offset: 1,
                  color: "#24a5cd",
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 0,
                  color: "#f0515e",
                },
                {
                  offset: 1,
                  color: "#ef8554",
                },
              ],
            },
          ];
          return params.dataIndex % 2
            ? "rgba(0,0,0,0)"
            : colorList[params.dataIndex / 2];
        },
        labelLine: {
          length: 40,
          length2: 40,
        },
      },
    },
    {
      animation: false,
      type: "pie",
      radius: ["48%", "55%"],
      data: values,
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      itemStyle: {
        color: function (params) {
          return params.dataIndex % 2 ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.3)";
        },
      },
    },
  ];
};

onMounted(async () => {
  try {
    const res = await systemApi.getDeviceNumber();
    if (!res?.code) {
      const values = [
        {
          value: res?.data?.online,
          name: "在线",
        },
        {
          value: res?.data?.offline,
          name: "离线",
        },
      ];
      const sum = values.reduce((prev, val) => prev + val.value, 0);
      resetOptions(values, sum);
    }
  } catch (error) {}
});
</script>

<template>
  <div class="device-status">
    <p class="device-status__title">设备状态分析</p>
    <div class="device-status__container">
      <Chart :option="option" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-status {
  padding-right: 16px;
  border-right: 2px solid var(--card-border-color);
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
    border: none;
    padding: 0;
  }
}
</style>
