<script setup>
import Chart from "./InnerChart.vue";
const props = defineProps({
    options:{
        type:Array,
        default:()=>[]
    }
})
</script>
<template>
  <Chart
    v-for="(option, index) in props.options"
    :key="index"
    :option="option"
  />
</template>
<style lang="scss" scoped>
.chart-container {
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 360px;
  border: 1px solid var(--normal-border-color);
  &:last-child {
    margin: 0;
  }
}
</style>
