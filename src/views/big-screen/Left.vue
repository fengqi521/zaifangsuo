<script setup>
import Card from "./components/Card.vue";
import PercentChart from "./components/Echart/PercentChart/index.vue";
import StatusLineChart from "./components/Echart/StatusLineChart/index.vue";
</script>
<template>
  <div class="dashboard-left">
    <!-- 设备数量统计-->
    <Card>
      <p class="card-title">设备数量占比</p>
      <PercentChart />
    </Card>

    <Card>
      <p class="card-title">设备运行统计</p>
      <StatusLineChart />
    </Card>

    <Card>
      <p class="card-title">传感器数量</p>
      <!-- <Chart /> -->
    </Card>
  </div>
</template>
<style lang="css" scoped>
.dashboard-left {
  display: grid;
  width: 400px;
  margin-right: 24px;
  grid-template-rows: 312px 312px 314px;
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
