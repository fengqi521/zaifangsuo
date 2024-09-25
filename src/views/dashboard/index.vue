<template>
  <div class="dashboard-container">
    <!-- 左侧内容 -->
    <Left
      :style="`transform:scale(${screenStore.scale});height:${screenStore._height}px`"
    />
    <!-- 地图 -->
    <Map :deviceList="mapDevice.lists" :fetchData="fetchData" />

    <!-- 右侧内容 -->
    <Right
      :style="`transform:scale(${screenStore.scale});height:${screenStore._height}px`"
    />

    <!-- 左侧时间和天气 -->
    <div
      class="weather-widget"
      :style="`transform:scale(${screenStore.scale})`"
    >
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
    <div
      class="forecast-container"
      :style="`transform:scale(${screenStore.scale})`"
    >
      <div class="weather-forecast">
        <div
          v-for="(item, index) in forecast"
          :key="index"
          class="forecast-item"
        >
          <span>{{ item.date }}</span>
          <span>{{ item.week }}</span>
          <span>{{ item.weather }}</span>
          <span>{{ item.temperature }}</span>
        </div>
      </div>
    </div>
    <!-- 选择设备 -->
    <div
      class="device-select"
      :style="`transform:scale(${screenStore.scale});right:${
        482 * screenStore.scale
      }px`"
    >
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
        全部
      </el-checkbox>
      <el-checkbox-group
        class="device-select__group"
        v-model="checkedDevice"
        @change="handleCheckedDeviceChange"
      >
        <el-checkbox
          v-for="item in devices"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";
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
const devices = ref([...deviceMap]);
const active = ref(0);
const { hourMinutes, day, getHourMinutes, getWeek, getCurrentDay } =
  useCurrentDate();

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
const mapDevice = reactive({
  lists: [],
});
const getDeviceList = async () => {
  screenStore.setData("area", []);
  screenStore.setData("deviceList", { values: [], status: [], data: [] });
  try {
    const res = await systemApi.getDeviceList({
      limit: 10000,
      page: 1,
      status: 2,
    });

    if (res.code) return;
    mapDevice.lists = res.data.list.filter((item) =>
      checkedDevice.value.includes(item.device_type)
    );

    // 设备状态统计数据
    const groupArea = groupBy(res.data.list, "zone");
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

    screenStore.setData("area", areaList);

    //  设备运行统计数据
    const groupByType = groupBy(res.data.list, "device_type");
    const values = [];
    const data = [];
    const status = ["离线", "在线"];
    Object.entries(groupByType).forEach(([deviceType, devices], index) => {
      const onlineCount = devices.filter((item) => item.online === 1).length;
      const offlineCount = devices.filter((item) => item.online === 0).length;
      const runData = status.map((item, ind) => {
        const statusList = [index, ind];
        if (item === "在线") {
          statusList.push(onlineCount);
        } else {
          statusList.push(offlineCount);
        }
        return statusList;
      });
      data.push(...runData);
      const list = deviceMap.find((item) => item.value === Number(deviceType));
      values.push(list?.label);
    });
    screenStore.setData("deviceList", {
      values,
      status,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

// 获取七天监测数据
const getDeviceRealData = (id, type) => {
  if (!id || !type) return;
  const times = getStartAndEndTime("week");
  systemApi
    .getRainData({ id, type, start_time: times[0], end_time: times[1] })
    .then((res) => {
      if (!res.code) {
        let list = {};
        switch (type) {
          case 1:
            list = res.data.list[0];
            break;
          case 2:
            list.timeList = res.data.list[0].timeList;
            list.rain = res.data.list[0].valueList;
            list.duration = res.data.list[1].valueList;
            list.total_rain = res.data.list[2].valueList;
            break;
          case 3:
            list = {
              timeList: res.data.list[0].timeList,
              valueList: res.data.list,
            };
            break;
          default:
            break;
        }
        screenStore.setData("monitorData", { type, data: list });
      }
    });
};

// 设备工况
const getWordData = (id, type) => {
  if (!id || !type) return;
  const times = getStartAndEndTime("week");
  systemApi
    .getWorkData({ id, type, start_time: times[0], end_time: times[1] })
    .then((res) => {
      if (!res.code) {
        console.log(res.data);
        const lists = res.data.list.slice(0, 2);
        const flag = lists.some((item) => item.timeList.length);
        if (!flag) {
          screenStore.setData("workData", []);
          return;
        }
        screenStore.setData("workData", lists);
      }
    });
};

// 设备数量占比
const getDeviceCategory = () => {
  systemApi.getDevicePercent().then((res) => {
    if (!res.code) {
      screenStore.setData("deviceCount", res.data.list);
    }
  });
};

// 选择设备类型操作
const checkAll = ref(true);
const checkedDevice = ref([...devices.value.map((item) => item.value)]);

// 选择全部
const handleCheckAllChange = (value) => {
  checkedDevice.value = value ? devices.value.map((item) => item.value) : [];
  getDeviceList();
};

// 单个选择
const handleCheckedDeviceChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === devices.value.length;
  getDeviceList();
};

watch(
  () => checkedDevice.value.length,
  (val) => {
    if (!val) {
      screenStore.setData("monitorData", {
        type: null,
        data: { timeList: [] },
      });
      screenStore.setData("workData", []);
      screenStore.setData("detail", {});
      screenStore.setData("id", null);
      screenStore.setData("type", null);
    }
  }
);

const fetchData = () => {
  const id = screenStore.screenData.id;
  const type = screenStore.screenData.type;
  if (!id || !type) return;
  // 设备详情
  getDeviceRealData(id, type);
  // 工况数据
  getWordData(id, type);
  const list = mapDevice.lists.find((item) => item.id === id);
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
  minuteTasksIntervalId = setInterval(minuteTasks, 60000);
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
  position: relative;
  height: 100%;

  .map-section {
    flex: 1;

    .map-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;

      &__item {
        color: #00fff6;
        height: 38px;
        line-height: 38px;
        font-size: 32px;
        font-weight: 700;
        font-size: 18px;
        border-radius: 4px;
        padding-inline: 24px;
        margin-inline: 24px;

        background: linear-gradient(
          1turn,
          rgba(0, 255, 254, 0),
          rgba(0, 255, 255, 0.3)
        );
        cursor: pointer;
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
    transform-origin: left;
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
    top: 43px;
    width: 350px;
    transform-origin: right top;
    overflow: hidden;
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

  .device-select {
    position: absolute;
    bottom: 16px;
    padding: 16px;
    transform-origin: right bottom;
    border: 1px solid var(--screen-card-border);
    background: rgba(0, 4, 15, 0.8);
    :deep(.el-checkbox__label) {
      color: #fff;
    }

    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #fff;
    }
    &__group {
      display: flex;
      flex-direction: column;
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
