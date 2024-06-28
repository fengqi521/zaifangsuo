<script setup>
import { ref, onMounted } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
import { getCommonPie } from "@/utils/chartdata";
const { initEchart, setEchartOption } = useEchartsHook();

const dataContainer = ref(null);
const option = ref(getCommonPie());

option.value.series[0].data = [
  { value: 16, name: "在线" },
  { value: 10, name: "离线" },
];
option.value.graphic = ref([
  {
    type: "group",
    left: "25%",
    top: "center",
    bounding: "raw",
    children: [
      {
        type: {
          text: "合计",
          fontSize: 18,
          textAlign: "center",
          textVerticalAlign: "bottom",
        },
      },
      {
        type: "text",
        style: { text: "200", textAlign: "center", textVerticalAlign: "top" ,fontSize:30},
      },
    ],
  },
]);

onMounted(() => {
  initEchart(dataContainer.value);
  setEchartOption(option.value);
});
</script>

<template>
  <div ref="dataContainer" class="chart-container"></div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
