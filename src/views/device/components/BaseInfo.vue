<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import ElCard from "@/components/ElCard/index.vue";
import ElTag from "@/components/ElTag/index.vue";

import rtuApi from "@/api/rtu";
import { isOnLine } from "@/utils";
import { deviceMap } from "@/constants";

const route = useRoute();
const { id } = route.params;

// 通过id获取详情
const detail = ref({});
const getDetailById = () => {
  rtuApi.getDeviceDetail({ id }).then((res) => {
    if (!res.code) {
      const list = deviceMap.find(
        (item) => item.value === res.data.device_type
      );
      detail.value = { ...res.data, deviceTypeName: list?.label };
    }
  });
};
getDetailById();
</script>
<template>
  <ElCard class="device-detail">
    <h3 class="device-detail__name">{{ detail.device_name }}</h3>
    <p class="device-detail__moditime">最后在线时间:{{ detail.online_last }}</p>
    <div class="device-detail__info">
      <p class="device-detail__item">
        <span class="device-detail__label">设备编号:</span>
        {{ detail.device_number }}
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">在线状态:</span>
        <ElTag
          :title="isOnLine(detail.online_last) ? '在线' : '离线'"
          :type="isOnLine(detail.online_last) ? 'online' : 'offline'"
        />
      </p>
      <p class="device-detail__item">
        <span class="device-detail__label">设备类型:</span>
        {{ detail.deviceTypeName }}
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
