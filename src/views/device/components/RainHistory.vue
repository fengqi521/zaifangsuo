<script setup>
import { reactive, ref, watch,watchEffect } from "vue";
import { useRoute } from "vue-router";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Chart from "@/components/Chart/index.vue";
import RainChart from "@/components/RainChart/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/js/chartData";
import systemApi from "@/api";

const useRtuStore = useRtuStoreHook();
const route = useRoute();

const { id, type } = route.params;
const searchInfo = ref({
  id,
  type,
  page: 1,
  limit: 10,
  start_time: "",
  end_time: "",
});

const tempOption = reactive({...getCommonLine({ seriesUnit: ["°C"] })}); //温度

const humidityOption = reactive({...getCommonLine({ seriesUnit: ["%RH"] })}); //湿度

const windOption = reactive({...getCommonLine({ seriesUnit: ["°"] })}); //风向

const speedOption = reactive({...getCommonLine({ seriesUnit: ["m/s"] })}); //风速

const atmosOption = reactive({...getCommonLine({ seriesUnit: ["hPa"] })}); //气压

const allOptions = ref([
  tempOption,
  humidityOption,
  windOption,
  speedOption,
  atmosOption,
]);

const rainData = reactive({
  timeList: [],
  rain: [],
  duration: [],
  total_rain: [],
  temperature: [],
  humidity: [],
  wind: [],
  speed: [],
  atmos: [],
});
// 获取雨量图表数据
const chartLoading = ref(false);
const getRainChartData = () => {
  chartLoading.value = true;
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getRainData(params).then((res) => {
    chartLoading.value = false;
    if (!res.code) {
      rainData.timeList = res.data.list[0].timeList;
      rainData.rain = res.data.list[0].valueList;
      rainData.duration = res.data.list[1].valueList;
      rainData.total_rain = res.data.list[2].valueList;
      rainData.temperature = res.data.list[3].valueList;
      rainData.humidity = res.data.list[4].valueList;
      rainData.wind = res.data.list[5].valueList;
      rainData.speed = res.data.list[6].valueList;
      rainData.atmos = res.data.list[7].valueList;
    }
  });
};

// 历史table数据
const loading = ref(false);
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "original_data", label: "降雨量(mm)" },
  { prop: "duration", label: "降雨时长(min)" },
  { prop: "data", label: "累计降雨量(mm)" },
  { prop: "temperature", label: "温度(°C)" },
  { prop: "humidity", label: "湿度(%RH)" },
  { prop: "wind_direction", label: "风向(°)" },
  { prop: "wind_speed", label: "风速(m/s)" },
  { prop: "atmos", label: "气压(hPa)" },
];
const deviceData = reactive({
  total: 0,
  data: [],
});

// 获取雨量历史数据
const getRainHistory = () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  systemApi.getRainHistory(searchInfo.value).then((res) => {
    loading.value = false;
    if (!res.code) {
      deviceData.total = res.data.total_count;
      deviceData.data = res.data.list.map((item, index) => ({
        ...item,
        num: (page - 1) * limit + index + 1,
      }));
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
 
  // 温度
  const temperatureMin = Math.min(...data.temperature);
  tempOption.color = ["#ff7e7e"];
  tempOption.legend.x = "center";
  tempOption.xAxis[0].data = data.timeList;
  tempOption.yAxis[0].name = "{title|温度(°C)}";
  tempOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 10];
  tempOption.yAxis[0].min = temperatureMin;

  tempOption.series[0] = {
    name: "温度",
    type: "line",
    data: data.temperature,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#ff7e7e ", "#ff0000"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };

  // 风向
  const windMin = Math.min(...data.wind);
  windOption.color = ["#00aaff"];
  windOption.legend.x = "center";
  windOption.xAxis[0].data = data.timeList;
  windOption.yAxis[0].name = "{title|风向(°)}";
  windOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0,10];
  windOption.yAxis[0].min = windMin;

  windOption.series[0] = {
    name: "风向",
    type: "line",
    data: data.wind,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#00aaff ", "#0033ff"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };

  // 风速
  const speedMin = Math.min(...data.speed);
  speedOption.color = ["#90ee90"];
  speedOption.legend.x = "center";
  speedOption.xAxis[0].data = data.timeList;
  speedOption.yAxis[0].name = "{title|风速(m/s)}";
  speedOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 20];
  speedOption.yAxis[0].min = speedMin;
  speedOption.series[0] = {
    name: "风速",
    type: "line",
    data: data.speed,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#90ee90 ", "#32cd32"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };

  // 湿度
  const humidityMin = Math.min(...data.humidity);
  humidityOption.color = ["#b3e5fc"];
  humidityOption.xAxis[0].data = data.timeList;
  humidityOption.yAxis[0].name = "{title|湿度(%RH)}";
  humidityOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 20];
  humidityOption.yAxis[0].min = humidityMin;
  humidityOption.series[0] = {
    name: "湿度",
    type: "line",
    data: data.humidity,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#b3e5fc ", "#03a9f4"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };

  // 气压
  const atmosMin = Math.min(...data.atmos);
  atmosOption.color = ["#ff733f"];
  atmosOption.xAxis[0].data = data.timeList;
  atmosOption.yAxis[0].name = "{title|气压(hPa)}";
  atmosOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 10];
  atmosOption.yAxis[0].min = atmosMin;
  atmosOption.series[0] = {
    name: "气压",
    type: "line",
    data: data.atmos,
    smooth: true,
    yAxisIndex: 0,
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: ["#FFA07A ", "#ff733f"].map((color, offset) => ({
          color,
          offset,
        })),
      },
    },
  };
};
// 监听图表数据变化
watchEffect(() => {
  resetOptions(rainData);
});

// 切换分页
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getRainHistory();
};

// 切换条数
const handleChangeSize = (size) => {
  searchInfo.value.page = 1;
  searchInfo.value.limit = size;
  getRainHistory();
};

const fetchData = (values) => {
  searchInfo.value.start_time = values[0];
  searchInfo.value.end_time = values[1];
  Object.assign(rainData, {
    timeList: [],
    rain: [],
    duration: [],
    total_rain: [],
    temperature: [],
    humidity: [],
    wind: [],
    speed: [],
  });

  Object.assign(deviceData, { data: [], total: 0 });
  getRainChartData();
  getRainHistory();
};

fetchData(useRtuStore.dateTimeRange);
watch(
  () => useRtuStore.dateTimeRange,
  (values) => {
    searchInfo.value.page = 1;
    fetchData(values);
  }
);
</script>

<template>
  <div class="device-data">
    <div class="device-data__history" v-loading="chartLoading">
      <ElCard title="雨量监测数据">
        <RainChart :data="rainData"></RainChart>
      </ElCard>
      <ElCard
        v-for="(option, index) in allOptions"
        :title="`${option?.series[0]?.name}监测数据`"
        :key="index"
      >
        <Chart :key="index" :option="option" />
      </ElCard>
    </div>

    <ElCard class="history-data-card" title="数据列表">
      <ElTable
        :loading="loading"
        :columns="tableColumns"
        :data="deviceData.data"
        :tableProps="{ showSelection: false, border: true }"
      />
      <ElPagination
        :currentPage="searchInfo.page"
        :page-size="searchInfo.limit"
        :total="deviceData.total"
        @pagination-change="handleChangePage"
        @page-size-change="handleChangeSize"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__history {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, 382px);
    gap: 16px;
  }

  .history-data-card {
    margin-top: 24px;
  }
}
</style>
