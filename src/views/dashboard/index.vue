<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left />
    <!-- 地图 -->
    <Map :deviceList="deviceList" />
    <!-- 右侧内容 -->
    <Right />
  </div>
</template>
<script setup>
import { reactive } from "vue";
import Map from "./Map.vue";
import Left from "./Left.vue";
import Right from "./Right.vue";
import rtuApi from "@/api/rtu";
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
const getStatus = ()=>{
  const res = {
    code:0,
    data:[
      {name:'泥位计',online:0,offline:2},
      {name:'雨量计',online:0,offline:1},
    ]
  }
}

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
}
</style>
