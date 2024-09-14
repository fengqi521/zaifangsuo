<script setup>
import Card from "./components/Card.vue";
import PercentChart from "./components/Echart/PercentChart/index.vue";
import StatusLineChart from "./components/Echart/StatusLineChart/index.vue";
import TotalChart from "./components/Echart/TotalChart/index.vue";
import MapChart from "./components/Echart/MapChart/index.vue";

</script>
<template>
  <div class="dashboard-left">
    <!-- 设备数量统计-->
    <Card>
      <p class="card-title">设备状态统计</p>
      <MapChart />
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
  position: absolute;
  top: 102px;
  left: 16px;
  bottom: 16px;
  transform-origin: left top;

  /* display: grid;
  grid-template-rows: repeat(3, 1fr); */
  /* row-gap: 12px; */
  z-index: 2;

  .card {
    background: rgba(0, 4, 15, 0.8);
    height:calc((100% - 24px) / 3);
    margin-bottom:12px;
    &:last-child{
      margin-bottom: 0;
    }
  }

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
