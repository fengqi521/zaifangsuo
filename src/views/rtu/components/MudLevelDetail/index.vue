<script setup>
import { reactive, ref, watch } from "vue";
import ElTabs from "@/components/ElTabs/index.vue";
import History from "./History.vue";
import Work from "./Work.vue";
import { getStartAndEndTime } from "@/utils/index";

const active = ref("day");
const dateTimeRange = ref([]);
const tabs = reactive([
  {
    title: "设备数据",
    component: History,
  },
  { title: "设备工况", component: Work },
]);



// 更新时间获取数据
watch(
  active,
  (newVal) => {
    dateTimeRange.value = getStartAndEndTime(newVal);
    getMudLevelHistory();
    getWorkHistory();
  },
  { immediate: true }
);
</script>

<template>
  <div class="device-data">
    <p class="device-data__title">基本信息</p>
    <ElTabs :tabs="tabs">
      <template #actions>
        <div class="device-data__actions">
          <el-radio-group v-model="active">
            <el-radio-button label="今天" value="day" />
            <el-radio-button label="本周" value="week" />
            <el-radio-button label="本月" value="month" />
          </el-radio-group>
          <el-date-picker
            v-model="dateTimeRange"
            type="datetimerange"
            range-separator="To"
            style="width: 355px"
          />
        </div>
      </template>
    </ElTabs>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__actions {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;

    .el-radio-group {
      margin-right: 12px;
    }
  }
}
</style>
