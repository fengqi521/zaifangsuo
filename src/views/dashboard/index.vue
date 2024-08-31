<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left />
    <!-- 地图 -->
    <div class="map-section">
      <Map :deviceList="deviceList" :fetchData="fetchData" />
      <ul class="map-controls">
        <li v-for="(item) in devices" :key="item.value"
          :class="['map-controls__item', { 'map-controls__item--action': active !== item.value }]"
          @click="handleActive(item.value)">
          {{ item.label }}
        </li>
      </ul>
    </div>

    <!-- 右侧内容 -->
    <Right />

    <!-- 左侧时间和天气 -->
    <div class="weather-widget">
      <div class="date-section">
        <span class="time-info">{{ hourMinutes }}</span>
        <p class="day-info">{{ day }}</p>
      </div>
      <div class="weather-section">
        <img :src="weatherInfo.path" alt="" class="weather-icon" />
        {{ weatherInfo.weather }}
        {{ weatherInfo.temp }}
      </div>
    </div>
    <!-- 天气预报广告 -->
    <div class="forecast-container">
      <div class="weather-forecast">
        <div v-for="(item, index) in forecast" :key="index" class="forecast-item">
          <span>{{ item.date }}</span>
          <span>{{ item.week }}</span>
          <span>{{ item.weather }}</span>
          <span>{{ item.temperature }}</span>
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
import { deviceMap, area, weather, weeks } from "@/constants";
import systemApi from "@/api";

const screenStore = useScreenStoreHook();
const devices = ref([{ label: '全部', value: 0 }, ...deviceMap])
const active = ref(0)
const { hourMinutes, day, getHourMinutes, getWeek, getCurrentDay } =
  useCurrentDate();
// 切换显示设备
const handleActive = (value) => {
  active.value = value;
  getDeviceList()
}
// 天气信息
const weatherInfo = ref({
  path: "",
  temp: "",
  weather: "",
});

// 获取实时天气
const getWeather = async () => {
  const res = await systemApi.getWeather({
    city: "北京市",
    extensions: "base",
  });
  if (!res.code) {
    const info = res?.data?.info?.lives[0];
    weatherInfo.value.temp = `${info.temperature}°C`;
    weatherInfo.value.path = weather[info.weather];
    weatherInfo.value.weather = info.weather;
  }
};

// 获取天气预报
const forecast = ref([]);
const getWeatherForecast = async () => {
  const res = await systemApi.getWeather({
    city: "北京市",
    extensions: "all",
  });

  if (!res.code) {
    const lists = res.data.info.forecasts[0].casts;
    forecast.value = lists.map((item) => {
      const { daytemp, nighttemp, dayweather, nightweather, week } = item;
      if (daytemp > nighttemp) {
        item.temperature = `${nighttemp}~${daytemp}°C`;
      } else if (daytemp < nighttemp) {
        item.temperature = `${daytemp}~${nighttemp}°C`;
      } else {
        item.temperature = `${daytemp}°C`;
      }

      if (dayweather === nightweather) {
        item.weather = nightweather;
      } else {
        item.weather = `${dayweather}转${nightweather}`;
      }

      item.week = weeks[week];
      return item;
    });
  }
};
// 获取设备列表数据
const deviceList = reactive([]);
const getDeviceList = async () => {
  deviceList.length = 0;
  try {
    const res = await systemApi.getDeviceList({
      limit: 10000,
      page: 1,
      status: 2,
    });

    if (res.code) return;
    let lists = []
    if (active.value) {
      lists = res.data.list.filter(item => item.device_type == active.value)
    } else {
      lists = res.data.list;
    }
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
let weatherIntervalId = null;
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
  secondTasks();
  minuteTasks();
  getWeather();
  getWeatherForecast();

  // 每秒钟执行一次 secondTasks
  secondIntervalId = setInterval(secondTasks, 1000);

  weatherIntervalId = setInterval(getWeather, 60 * 60 * 1000);

  // 每分钟执行一次 minuteTasks
  minuteTasksIntervalId = setInterval(minuteTasks, 30000);
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

  .map-section {
    flex: 1;

    @keyframes jump {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-10px);
      }
    }

    .map-controls {
      display: flex;
      align-items: center;
      height: 100px;




      &__item {
        font-size: 18px;
        color: #FFF;
        padding-inline: 24px;
        cursor: pointer;

      }

      &__item--action {
        animation: jump 1s infinite;
      }
    }
  }

  .dashboard-left,
  .dashboard-right {
    width: 450px;
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
      align-items: center;
      padding-left: 16px;
      font-size: 18px;

      .weather-icon {
        margin-right: 8px;
        width: 38px;
      }
    }
  }

  .forecast-container {
    position: absolute;
    white-space: nowrap;
    right: 16px;
    top: 40px;
    width: 350px;
    overflow: hidden
  }

  .weather-forecast {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #00fff6;
    font-weight: bold;
    padding-right: 100%;
    animation: marquee 15s linear infinite;

    .forecast-item {
      margin-right: 18px;

      span {
        margin-right: 8px;
      }
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-330%);
    }
  }
}
</style>
