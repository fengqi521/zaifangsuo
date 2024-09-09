<script setup>
import { ref, computed, watchEffect, defineAsyncComponent, watch } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import {
  BaseInfo,
  MudHistory,
  RainHistory,
  BreakHistory,
  Work,
} from "../components";

const useRtuStore = useRtuStoreHook();
const route = useRoute();

const { id, type } = route.params;
const active = ref("day");
const workRef = ref(null);

const componentLists = [
  {
    type: 1,
    component: MudHistory,
  },
  { type: 2, component: RainHistory },
  { type: 3, component: BreakHistory },
];
const currentComponent = computed(() => {
  const list = componentLists.find((item) => item.type == type);
  return list?.component ?? null;
});

const activeTab = ref("data");
// 导航
const breadList = ref([
  { to: "/device", title: "设备管理" },
  { title: "设备详情" },
]);

watchEffect(() => {
  if (!active.value) return;
  useRtuStore.setDateRange(active.value);
});

const dateRange = computed({
  get: () => useRtuStore.dateTimeRange,
  set: (newValue) => {
    active.value = "";
    useRtuStore.setDateRange(newValue, true);
  },
});
</script>

<template>
  <div class="detail-data">
    <Bread :breadList="breadList" />
    <BaseInfo />
    <div class="detail-data__content">
      <div class="detail-data__actions">
        <el-radio-group v-model="active">
          <el-radio-button label="今天" value="day" />
          <el-radio-button label="本周" value="week" />
          <el-radio-button label="本月" value="month" />
        </el-radio-group>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          style="width: 355px"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="设备数据" name="data">
          <component :is="currentComponent" v-if="activeTab === 'data'" />
        </el-tab-pane>
        <el-tab-pane label="设备工况" name="work">
          <Work ref="workRef" v-if="activeTab === 'work'"
        /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__tabs {
    margin-top: 24px;
  }

  &__content {
    position: relative;
  }

  &__actions {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 1;

    .el-radio-group {
      margin-right: 12px;
    }
  }
}
</style>
