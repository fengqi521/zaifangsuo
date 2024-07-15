<script setup>
import ElCard from "@/components/ElCard/index.vue";
const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
});

</script>
<template>
  <ElCard>
    <h3 class="device-detail__name">{{ detail.name }}</h3>
    <p class="device-detail__moditime">最新数据时间:{{ detail.moditime }}</p>
    <div class="device-detail__info">
      <p class="device-detail__item">
        <span class="device-detail__label">设备编号:</span>
        {{ detail.cusno }}
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">在线状态:</span>
        <el-tag :type="detail.status?'success':'warning'">{{ detail.status?'在线':'离线' }}</el-tag>
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">设备类型:</span>
        {{ detail.devicetypename }}
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">位置信息(经纬度):</span>
        {{ `${detail.lng},${detail.lat}` }}
      </p>
    </div>
  </ElCard>
</template>
<style lang="scss" scoped>
.device-detail__name {
  font-weight: bold;
  font-size: 18px;
  color: var(--normal-title-color);
  line-height: 24px;
  text-align: left;
  font-style: normal;
}

.device-detail__moditime {
  margin-top: 8px;
  line-height: 24px;
  font-size: 14px;
  color: var(--normal-subtitle-color);
}

.device-detail__info {
  display: flex;
  margin-top: 16px;
  line-height: 24px;
  font-size: 14px;

  .device-detail__item {
    margin-right: 24px;
    color: var(--sidebar-active-bg-color);
    opacity: .8;
  }

  .device-detail__label {
    color: var(--normal-subtitle-color);
  }
}
</style>
