<script setup>
import Card from "./components/Card.vue";
import Chart from "@/components/Chart/index.vue";
</script>
<template>
  <div class="dashboard-right">
    <!-- 设备数量统计-->
    <Card>
      <p class="card-title">设备数量统计</p>
      <Chart />
    </Card>

    <Card>
      <p class="card-title">设备运行统计</p>
      <Chart />
    </Card>

    <Card>
      <p class="card-title">传感器数量</p>
      <Chart />
    </Card>
  </div>
</template>
<style lang="css" scoped>
.dashboard-right {
  width: 400px;
  margin-left: 24px;
  display: grid;
  grid-template-rows: 312px 312px 314px;
  row-gap: 12px;

  .card-title {
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    margin-bottom: 14px;
  }
}
</style>
