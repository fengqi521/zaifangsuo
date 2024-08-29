<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left />
    <!-- 地图 -->
    <Map :deviceList="deviceList" :fetchData="fetchData" />

    <!-- 右侧内容 -->
    <Right />

    <div class="weather-widget">
      <div class="date-section">
        <span class="time-info">{{ hourMinutes }}</span>
        <p class="day-info">{{ day }}</p>
      </div>
      <div class="weather-section">
        <img :src="weatherInfo.path" alt="" class="weather-icon" />
        <div class="weather-details">
          <p class="weather-desc">{{ weatherInfo.weather }}</p>
          <p>{{ weatherInfo.temp }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import Map from "./Map.vue";
import Left from "./Left.vue";
import Right from "./Right.vue";

import { groupBy, orderBy } from "lodash";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getStartAndEndTime, isOnLine } from "@/utils";
import { deviceMap, area, weather } from "@/constants";
import systemApi from "@/api";

const screenStore = useScreenStoreHook();

const { hourMinutes, weekday, day, getHourMinutes, getWeek, getCurrentDay } =
  useCurrentDate();

// 获取天气信息
const weatherInfo = ref({
  path: "",
  temp: "",
  weather: "",
});
const getWeather = async () => {
  const res = await systemApi.getWeather({ city: "北京市", extensions: "all" });
  if (!res.code) {
    const {
      info: { forecasts },
    } = res.data;
    const { daytemp, nighttemp, dayweather, nightweather } =
      forecasts[0].casts[0];

    if (daytemp > nighttemp) {
      weatherInfo.value.temp = `${nighttemp}~${daytemp}°C`;
    } else if (daytemp < nighttemp) {
      weatherInfo.value.temp = `${daytemp}~${nighttemp}°C`;
    } else {
      weatherInfo.value.temp = `${daytemp}°C`;
    }

    if (dayweather === nightweather) {
      weatherInfo.value.weather = nightweather;
    } else {
      weatherInfo.value.weather = `${dayweather}转${nightweather}`;
    }
    weatherInfo.value.path = weather[nightweather];
  }
};
getWeather();
// 获取设备列表数据
const deviceList = reactive([]);
const getDeviceList = async () => {
  try {
    const res = await systemApi.getDeviceList({
      limit: 10000,
      page: 1,
      status: 2,
    });

    if (res.code) return;

    const lists = res.data.list;
    Object.assign(deviceList, lists);
    const groupArea = groupBy(lists, "zone");
    let areaList = [...area].map((item) => ({
      ...item,
      online: 0,
      offline: 0,
      total: 0,
    }));
    Object.entries(groupArea).forEach(([zone, devices]) => {
      const onlineCount = devices.filter((item) => item.online === 1).length;
      const offlineCount = devices.filter((item) => item.online === 0).length;
      const list = areaList.find((cur) => cur.code == zone);
      list.online = onlineCount;
      list.offline = offlineCount;
      list.total = onlineCount + offlineCount;
    });

    areaList = orderBy(areaList, "total", "desc");
    screenStore.setData("area", {
      values: areaList.map((item) => item.label),
      online: areaList.map((item) => item.online),
      offline: areaList.map((item) => item.offline),
    });

    const groupByType = groupBy(lists, "device_type");
    const values = [];
    const onlineArr = [];
    const offlineArr = [];

    Object.entries(groupByType).forEach(([deviceType, devices]) => {
      const onlineCount = devices.filter((item) => item.online === 1).length;
      const offlineCount = devices.filter((item) => item.online === 0).length;
      onlineArr.push(onlineCount);
      offlineArr.push(offlineCount);
      const list = deviceMap.find((item) => item.value === Number(deviceType));
      values.push(list?.label);
    });

    screenStore.setData("deviceList", {
      values,
      online: onlineArr,
      offline: offlineArr,
    });
    // screenStore.setData("area", areaList); // Uncomment if needed
  } catch (error) {
    console.log(error);
  }
};

// 获取七天监测数据
const getDeviceRealData = (id, type) => {
  const times = getStartAndEndTime("week");
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
  // screenStore.setData("deviceCount", []);
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

let secondIntervalId = null;
let minuteTasksIntervalId = null;
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
  secondIntervalId = setInterval(secondTasks, 1000);

  // 每分钟执行一次 minuteTasks
  minuteTasksIntervalId = setInterval(minuteTasks, 10000);
});

onUnmounted(() => {
  if (secondIntervalId) {
    clearInterval(secondIntervalId);
  }

  if (minuteTasksIntervalId) {
    clearInterval(minuteTasksIntervalId);
  }
});
</script>
<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  height: 100%;

  .dashboard-left,
  .dashboard-right {
    width:3rem;
  }

  .weather-widget {
    display: flex;
    align-items: center;
    position: absolute;
    left: 16px;
    top: 32px;
    font-weight: bold;
    color: #00fff6;
    text-align: right;
  }

  .date-section {
    padding-right: 20px;
    width: 117px;
    border-right: 1px solid rgba(0, 237, 231, 0.5);
    .time-info {
      font-size: 24px;
    }

    .day-info {
      font-size: 14px;
    }
  }

  .weather-section {
    display: flex;
    padding-left: 16px;

    .weather-details {
      margin-left: 10px;
      font-size: 16px;
    }

    .weather-desc {
      font-size: 14px;
      font-weight: normal;
    }

    .weather-icon {
      width: 38px;
    }
  }
}
</style>
