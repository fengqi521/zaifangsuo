<script setup>
import { onMounted, ref } from "vue";
import { useEchartsHook } from "@/hooks/useEcharts";
const { initEchart, setEchartOption } = useEchartsHook();

// 定义变量
const lineContainer = ref(null);
const props = defineProps({
  option: {
    type: Object,
    require: true,
  },
});

onMounted(() => {
  // 初始化echarts
  initEchart(lineContainer.value);
  setEchartOption(props.option);
});
</script>
<template>
  <div class="line-container" ref="lineContainer"></div>
</template>
<style lang="scss" scoped>
.line-container{
  width:100%;
  height:300px;
}
</style>