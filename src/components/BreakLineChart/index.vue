<script setup>
import { watch, reactive } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/js/chartData";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ timeList: [], valueList: [] }),
  },
});

const collectOption = reactive({ ...getCommonLine({ seriesUnit: [""] }) });
// 图表数据重组
const resetOptions = (values) => {
  if (!values.length) return;
  const colors = ["#e32f46", "#94d96c", "#7049f0"];
  const timeList = values[0].timeList;
  collectOption.color = colors;
  collectOption.legend = {
    ...collectOption.legend,
    show:true,
    data:values.map(item=>item.name)
  }
  collectOption.xAxis[0].data = timeList;
  collectOption.yAxis[0].name = "{title|1代表断开、0代表正常}";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 75];
  collectOption.series = values.map((item) => {
    return {
      name: `${item.name}`,
      type: "line",
      data: item.valueList,
      Symbol: "circle",
      smooth: true,
    };
  });
};
watch(
  () => props.data,
  (values) => {
    resetOptions(values);
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <Chart :option="collectOption" />
</template>
