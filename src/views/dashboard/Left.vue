<script setup>
import Card from "./components/Card.vue";
import PercentChart from "./components/Echart/PercentChart/index.vue";
import StatusLineChart from "./components/Echart/StatusLineChart/index.vue";
import TotalChart from "./components/Echart/TotalChart/index.vue";
</script>
<template>
  <div class="dashboard-left">
    <!-- 设备数量统计-->

    <Card>
      <p class="card-title">设备状态统计</p>
      <TotalChart />
    </Card>
    <Card>
      <p class="card-title">设备数量占比</p>
      <PercentChart />
    </Card>

    <Card>
      <p class="card-title">设备运行统计</p>
      <StatusLineChart />
    </Card>
  </div>
</template>
<style lang="css" scoped>
.dashboard-left {
  display: grid;
  margin-right: 24px;
  grid-template-rows: 314px 312px 312px;
  row-gap: 12px;

  :deep(.chart-container) {
    height: calc(100% - 38px);
    padding: 0;
    border: none;
  }

  .card-title {
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    margin-bottom: 14px;
  }
}
</style>
