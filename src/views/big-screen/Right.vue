<script setup>
import Card from "./components/Card.vue";
import Chart from "@/components/Chart/index.vue";
import CollectChart from "./components/Echart/CollectChart/index.vue";
import WorkChart from "./components/Echart/WorkChart/index.vue";

</script>
<template>
  <div class="dashboard-right">
    <!-- 设备数量统计-->
    <Card>
      <p class="card-title">近七天监测数据</p>
      <CollectChart />
    </Card>

    <Card>
      <p class="card-title">近七天设备工况</p>
      <WorkChart />
    </Card>

    <Card>
      <p class="card-title">传感器数量</p>
      <!-- <LineChart /> -->
    </Card>
  </div>
</template>
<style lang="css" scoped>
.dashboard-right {
  display: grid;
  grid-template-rows: 312px 312px 314px;
  row-gap: 12px;
  width: 400px;
  margin-left: 24px;
  
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
