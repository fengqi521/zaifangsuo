<template>
  <div>
    <p class="chart-title">{{ props.option.name }}</p>
    <Chart :option="commonOption" />
  </div>
</template>
<script setup>
import { watch, reactive } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";
const commonOption = reactive({});
const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
});

const resetOption = (option) => {
  console.log(option);
  const { type, data } = option;

  if (type == 1) {
    Object.assign(commonOption, { ...getCommonLine({ seriesUnit: ["m"] }) });
    commonOption.xAxis[0].data = data.timeList;
    commonOption.yAxis[0].name = "{title|泥水位(m)}";
    commonOption.yAxis[1].show = false;
    const min = Math.min(...data.valueList);

    commonOption.yAxis[0].min = min;
    commonOption;
    commonOption.series[0] = {
      name: "泥水位",
      type: "line",
      data: data.valueList,
      Symbol: "circle",
      smooth: true,
    };
  }

  if (type == 2) {
    // 雨量
    Object.assign(commonOption, {
      ...getCommonLine({ seriesUnit: ["mm", "mm", "min"] }),
    });
    commonOption.legend = {
      ...commonOption.legend,
      show: true,
      x: "center",
      data: ["降雨量", "累计降雨量", "降雨时长"],
      textStyle: {
        rich: {
          a: {
            verticalAlign: "middle",
          },
        },
        padding: [0, 0, -4, 0],
      },
    };
    const rainMin = Math.min(...data.rain);

    commonOption.xAxis[0].data = data.timeList;
    commonOption.yAxis[0].name = "{title|降雨量(mm)}";
    commonOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 20];
    commonOption.yAxis[0].min = rainMin;

    commonOption.yAxis[1].name = "{title|降雨时长(min)}";
    commonOption.yAxis[1].nameTextStyle.rich.title.padding = [0, 40, 0, 0];
    commonOption.yAxis[1].alignTicks = true;

    const durationMin = Math.min(...data.duration);
    commonOption.yAxis[1].min = durationMin;

    commonOption.series[0] = {
      name: "降雨量",
      type: "line",
      data: data.rain,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: 0,
    };
    commonOption.series[1] = {
      name: "累计降雨量",
      type: "line",
      data: data.total_rain,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: 0,
    };
    commonOption.series[2] = {
      name: "降雨时长",
      type: "line",
      data: data.duration,
      Symbol: "circle",
      smooth: true,
      yAxisIndex: 1,
    };
  }

  if (type == 3) {
    Object.assign(commonOption, { ...getCommonLine({ seriesUnit: [""] }) });
    commonOption.legend.show = true;
    commonOption.xAxis[0].data = data.timeList;
    commonOption.yAxis[0].name = "{title|1代表断开、0代表正常}";
    commonOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 65];
    commonOption.series[0] = {
      name: "断线状态",
      type: "line",
      data: data.valueList,
      Symbol: "circle",
      smooth: true,
    };
  }
};

watch(
  props.option,
  (option) => {
    resetOption(option);
  },
  { deep: true, immediate: true }
);
</script>
<style lang="scss" scoped>
.chart-title {
  font-size: 14px;
  line-height: 24px;
  color: var(--normal-title-color);
  font-weight: 700;
}
:deep(.chart-container) {
  height: calc(100% - 24px);
  padding: 10px;
}
</style>
