<script setup>
import ElCard from "@/components/ElCard/index.vue";
import MudLevelChart from "./MudLevelChart.vue";
import MudLevelImage from './MudLevelImage.vue'
</script>
<template>
  <div class="detail-container">
    <p class="detail-title">设备数据</p>
    <ElCard title="传感器监测历史数据" >
      <MudLevelChart/>
      <MudLevelImage/>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.detail-container {
  .detail-title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }
}
</style>
