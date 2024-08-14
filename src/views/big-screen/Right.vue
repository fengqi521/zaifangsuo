<script setup>
import Card from "./components/Card.vue";
import CollectChart from "./components/Echart/CollectChart/index.vue";
import WorkChart from "./components/Echart/WorkChart/index.vue";
import DetailChart from "./components/Echart/DetailChart/index.vue";
</script>
<template>
  <Card class="dashboard-right">
    <!-- 设备数量统计-->

    <div class="card-item">
      <p class="card-title">设备详情</p>
      <DetailChart />
    </div>

    <div class="card-item">
      <p class="card-title">近七天监测数据</p>
      <CollectChart />
    </div>
    <div class="card-item">
      <p class="card-title">近七天设备工况</p>
      <WorkChart />
    </div>
  </Card>
</template>
<style lang="css" scoped>
.dashboard-right {
  display: grid;
  grid-template-rows: 283px 311px 311px;
  row-gap: 12px;
  margin-left: 24px;

  .card-item{
    border:1px solid var(--screen-card-border);
    padding:16px;
    background: linear-gradient(
      rgba(0, 255, 254, 0) 0%,
      rgba(0, 196, 255, 0.2) 100%
    );
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
