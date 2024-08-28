<script setup>
import Chart from "./InnerChart.vue";
const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<template>
  <Chart :option="option" />
</template>
<style lang="scss" scoped>
.chart-container {
  padding: 16px;
  width: 100%;
  // height: 420px;
  border: 1px solid var(--card-border-color);
  &:last-child {
    margin: 0;
  }
}
</style>
