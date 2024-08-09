<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left />
    <!-- 地图 -->
    <Map :deviceList="deviceList" />

    <!-- 右侧内容 -->
    <Right />

    <div class="date-container">
      <span class="time-info">{{ hourMinutes }}</span>
      <div class="date-info">
        <p class="week">{{ weekday }}</p>
        <p class="day">{{ day }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import Map from "./Map.vue";
import Left from "./Left.vue";
import Right from "./Right.vue";

import { useCurrentDate } from "@/hooks/useCurrentDate";
import rtuApi from "@/api/rtu";

const { hourMinutes, weekday, day, getHourMinutes, getWeek, getCurrentDay } =
  useCurrentDate();

// setInterval(() => {
//   getHourMinutes();
//   getWeek();
//   getCurrentDay();
// }, 1000);
// 获取设备列表数据
const deviceList = reactive([]);
const getDeviceList = () => {
  rtuApi.getDeviceList({ limit: 10000, page: 1, status: 2 }).then((res) => {
    if (!res.code) {
      Object.assign(deviceList, res.data.list);
    }
  });
};

// 获取设备运行数据
const getStatus = () => {
  const res = {
    code: 0,
    data: [
      { name: "泥位计", online: 0, offline: 2 },
      { name: "雨量计", online: 0, offline: 1 },
    ],
  };
};

getDeviceList();
</script>
<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  height: 100%;

  .dashboard-left,
  .dashboard-right {
    width: 480px;
  }

  .date-container {
    position: absolute;
    right:84px;
    top:42px;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 16px;
    color: #00fff6;
  }

  .time-info {
    line-height: 38px;
    font-size: 24px;
    padding-right: 16px;
    border-right: 1px solid rgba(0, 237, 231, 0.5);
  }

  .date-info {
    padding-left: 16px;
    line-height: 21px;
  }
}
</style>
