<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left />
    <!-- 地图 -->
    <Map :deviceList="deviceList" :fetchData="fetchData" />

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
import { ref, reactive, onMounted } from "vue";
import Map from "./Map.vue";
import Left from "./Left.vue";
import Right from "./Right.vue";

import { groupBy } from "lodash";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getStartAndEndTime,isOnLine } from "@/utils";
import { deviceMap } from "@/constants";
import systemApi from "@/api";

const screenStore = useScreenStoreHook();

const { hourMinutes, weekday, day, getHourMinutes, getWeek, getCurrentDay } =
  useCurrentDate();

// 获取设备列表数据
const deviceList = reactive([]);
const getDeviceList = () => {
  systemApi.getDeviceList({ limit: 10000, page: 1, status: 2 }).then((res) => {
    if (!res.code) {
      Object.assign(deviceList, res.data.list);
      try {
        const lists = res.data.list;
        const groupByType = groupBy(lists, "device_type");
        let onlineArr = [];
        let offlineArr = [];
        let values = [];
        Object.entries(groupByType).forEach(([deviceType, devices]) => {
          const online = devices.filter((item) => item.online === 1);
          const offline = devices.filter((item) => item.online === 0);
          onlineArr.push(online.length);
          offlineArr.push(offline.length);
          const list = deviceMap.find(
            (item) => item.value === Number(deviceType)
          );
          values.push(list?.label);
        });

        screenStore.setData("deviceList", {
          values,
          online: onlineArr,
          offline: offlineArr,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
};

// 获取七天监测数据
const getDeviceRealData = (id, type) => {
  const times = getStartAndEndTime("month");
  systemApi
    .getRainData({ id, type, start_time: times[0], end_time: times[1] })
    .then((res) => {
      if (!res.code) {
        const lists = type === 1 ? [res.data.list[0]] : res.data.list;
        screenStore.setData("monitorData", lists);
      }
    });
};

// 设备工况
const getWordData = (id, type) => {
  const times = getStartAndEndTime("week");
  systemApi
    .getWorkData({ id, type, start_time: times[0], end_time: times[1] })
    .then((res) => {
      if (!res.code) {
        const lists = res.data.list;
        const flag = lists.some((item) => item.timeList.length);
        if (!flag) {
          screenStore.setData("workData", []);
          return;
        }
        screenStore.setData("workData", lists);
      }
    });
};

// 设备数量
const getDeviceCategory = () => {
  systemApi.getDevicePercent().then((res) => {
    if (!res.code) {
      screenStore.setData("deviceCount", res.data.list);
    }
  });
};

const fetchData = () => {
  const id = screenStore.screenData.id;
  const type = screenStore.screenData.type;
  if (!id || !type) return;
  getDeviceRealData(id, type);
  getWordData(id, type);
  const list = deviceList.find((item) => item.id === id);
  const curDeviceType = deviceMap.find(
    (item) => item.value === list.device_type
  );
  screenStore.setData("type", type);
  screenStore.setData("detail", {
    ...list,
    type: curDeviceType.label,
    loc: `${list.langitude},${list.latitude}`,
    status: isOnLine(list.online_last) ? "在线" : "离线",
  });
};

onMounted(() => {
  getDeviceList();
  getDeviceCategory();
  // 定义每秒钟执行的任务
  const secondTasks = () => {
    getHourMinutes();
    getWeek();
    getCurrentDay();
  };

  // 定义每分钟执行的任务
  const minuteTasks = () => {
    getDeviceList();
    getDeviceCategory();
    fetchData();
  };

  // 每秒钟执行一次 secondTasks
  setInterval(secondTasks, 1000);

  // 每分钟执行一次 minuteTasks
  setInterval(minuteTasks, 60000);
});
</script>
<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  height: 100%;

  .dashboard-left,
  .dashboard-right {
    width: 500px;
  }

  .date-container {
    position: absolute;
    right: 84px;
    top: 42px;
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
