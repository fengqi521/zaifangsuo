<template>
  <div class="detail">
    <div v-for="(item, index) in lists" :key="index" class="detail-item">
      <p class="detail-label">{{ item.label }}</p>
      <p class="detail-value">{{ item.value }}</p>
    </div>
  </div>
</template>
<script setup>
import {  ref, watch } from "vue";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
const lists = ref([
  { label: "设备名称", field: "device_name" },
  { label: "设备类型", field: "type" },
  { label: "设备状态", field: "status" },
  { label: "设备经纬度坐标", field: "loc" },
  { label: "设备地址", field: "location" },
  { label: "设备离线时间", field: "online_last" },
]);
watch(
  () => screenStore.screenData.detail,
  (values) => {
    lists.value.forEach((item) => {
      item.value = values[item.field];
    });
  }
);
</script>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.detail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(0, 1fr));
  gap: 8px;

  .detail-item {
    color: #96b4be;
    padding: 8px 12px;
    background: rgba(0, 255, 255, 0.2);

    .detail-label {
      margin-bottom: 4px;
      font-size: 14px;
    }

    .detail-value {
      padding: 4px 0;
      line-height: 18px;
      font-weight: bold;
      font-size: 16px;
      color: #00fff6;
      @extend %ellipsis;
    }
  }
}
</style>
