<script setup>
import ElCard from "@/components/ElCard/index.vue";
import ElTag from "@/components/ElTag/index.vue";
const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<template>
  <ElCard class="device-detail">
    <h3 class="device-detail__name">{{ detail.device_name }}</h3>
    <p class="device-detail__moditime">最新数据时间:{{ detail.update_time }}</p>
    <div class="device-detail__info">
      <p class="device-detail__item">
        <span class="device-detail__label">设备编号:</span>
        {{ detail.device_number }}
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">在线状态:</span>
        <ElTag
          :title="detail.online ? '在线' : '离线'"
          :type="detail.online ? 'online' : 'offline'"
        />
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">设备类型:</span>
        {{ detail.device_type }}
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">位置信息(经纬度):</span>
        {{ `${detail.langitude},${detail.latitude}` }}
      </p>
    </div>
  </ElCard>
</template>
<style lang="scss" scoped>
.device-detail {
  margin-bottom: 24px;
}
.device-detail__name {
  font-weight: bold;
  font-size: 18px;
  color: var(--normal-title-color);
  line-height: 24px;
  text-align: left;
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
    color: var(--normal-title-color);
  }

  .device-detail__label {
    color: var(--normal-subtitle-color);
  }
}
</style>
