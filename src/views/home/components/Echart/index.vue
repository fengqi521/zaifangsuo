<script setup>
import DataChart from './DataChart/index.vue'

</script>
<template>
  <div class="chart-container">
    <!-- 左侧在线离线数量统计 -->
    <DataChart />
    <!-- 右侧设备数量占比统计 -->
    <div></div>
  </div>
</template>
<style lang="scss" scoped>
.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding:16px;
  height: 332px;
  background:var(--background-color)
}
</style>