<script setup>
import DataChart from './DataChart/index.vue'
import PercentChart from './PercentChart/index.vue'


</script>
<template>
  <div class="chart-container">
    <!-- 左侧在线离线数量统计 -->
    <DataChart />
    <!-- 右侧设备数量占比统计 -->
    <PercentChart />
  </div>
</template>
<style lang="scss" scoped>
.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 400px;
  padding: 16px;
  background: var(--background-color);
  border: 1px solid var(--card-border-color);
}
</style>