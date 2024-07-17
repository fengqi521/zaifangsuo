<script setup>
import { provide } from "vue";
import Chart from "./InnerChart.vue";
const props = defineProps({
    options:{
        type:Array,
        default:()=>[]
    },
    eleNames:{
      type:Array,
      default:()=>[]
    }
})

provide('names',props.eleNames)
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
  width: 100%;
  height: 420px;
  border: 1px solid var(--card-border-color);
  &:last-child {
    margin: 0;
  }
}
</style>
