<script setup>
import { reactive, ref, watchEffect, computed, watch } from "vue";
import { useRoute } from "vue-router";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Chart from "@/components/Chart/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/utils/chartData";
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
// 图表
const rainOption = reactive(
  getCommonLine({
    seriesUnit: ["mm", "mm", "min"],
  })
); //雨量

const tempOption = reactive(getCommonLine({ seriesUnit: ["°C"] })); //温度

const humidityOption = reactive(getCommonLine({ seriesUnit: ["°"] })); //湿度

const windOption = reactive(getCommonLine({ seriesUnit: ["°"] })); //风向

const speedOption = reactive(getCommonLine({ seriesUnit: ["m/s"] })); //风速

const allOptions = ref([tempOption, humidityOption, windOption, speedOption]);

const rainData = reactive({
  timeList: [],
  rain: [],
  duration: [],
  total_rain: [],
  temperature: [],
  humidity: [],
  wind: [],
  speed: [],
});
// 获取雨量图表数据
const getRainChartData = () => {
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getRainData(params).then((res) => {
    if (!res.code) {
      rainData.timeList = res.data.list[0].timeList;
      rainData.rain = res.data.list[0].valueList;
      rainData.duration = res.data.list[1].valueList;
      rainData.total_rain = res.data.list[2].valueList;
      rainData.temperature = res.data.list[3].valueList;
      rainData.humidity = res.data.list[4].valueList;
      rainData.wind = res.data.list[5].valueList;
      rainData.speed = res.data.list[6].valueList;
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
  // 雨量
  const colors = ["#ffd285", "#ff733f"];
  rainOption.legend = {
    ...rainOption.legend,
    show: true,
    x: "center",
    data: ["降雨量", "累计降雨量", "降雨时长"],
    textStyle: {
      rich: {
        a: {
          verticalAlign: "middle",
        },
      },
      padding: [0, 0, -4, 0],
    },
  };
  rainOption.xAxis[0].data = data.timeList;
  rainOption.yAxis[0].name = "{title|降雨量(mm)}";
  rainOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 20];
  rainOption.yAxis[1].name = "{title|累计降雨量(mm)}";
  rainOption.yAxis[1].nameTextStyle.rich.title.padding = [0, 40, 0, 0];
  rainOption.yAxis[1].alignTicks = true;
  rainOption.series[0] = {
    name: "降雨量",
    type: "line",
    data: data.rain,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };
  rainOption.series[1] = {
    name: "累计降雨量",
    type: "line",
    data: data.total_rain,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };
  rainOption.series[2] = {
    name: "降雨时长",
    type: "line",
    data: data.duration,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 1,
  };

  // 温度
  tempOption.color = ["#ff7e7e"];
  tempOption.legend.x = "center";
  tempOption.xAxis[0].data = data.timeList;
  tempOption.yAxis[0].name = "{title|温度(°C)}";
  tempOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 0];

  tempOption.series[0] = {
    name: "温度",
    type: "line",
    data: data.rain,
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
  windOption.color = ["#00aaff"];
  windOption.legend.x = "center";
  windOption.xAxis[0].data = data.timeList;
  windOption.yAxis[0].name = "{title|风向(°)}";
  windOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 0];

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
  speedOption.color = ["#90ee90"];
  speedOption.legend.x = "center";
  speedOption.xAxis[0].data = data.timeList;
  speedOption.yAxis[0].name = "{title|风速(m/s)}";
  speedOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 0];
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
  humidityOption.color = ["#b3e5fc  "];
  humidityOption.xAxis[0].data = data.timeList;
  humidityOption.yAxis[0].name = "{title|湿度(m/s)}";
  humidityOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 0];
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
};

// 历史table数据
const loading = ref(false);
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "data", label: "降雨量(mm)" },
  { prop: "duration", label: "降雨时长(min)" },
  { prop: "data_rain", label: "累计降雨量(mm)" },
  { prop: "temperature", label: "温度(°C)" },
  { prop: "humidity", label: "湿度(%RH)" },
  { prop: "wind_direction", label: "风向(°)" },
  { prop: "wind_speed", label: "风速(m/s)" },
];
const deviceData = reactive({
  total: 0,
  data: [],
});

// 获取雨量历史数据
const getRainHistory = () => {
  const { page, limit } = searchInfo.value;
  systemApi.getRainHistory(searchInfo.value).then((res) => {
    if (!res.code) {
      deviceData.total = res.data.total_count;
      deviceData.data = res.data.list.map((item, index) => ({
        ...item,
        num: (page - 1) * limit + index + 1,
      }));
    }
  });
};

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

// 监听图表数据变化
watchEffect(() => {
  resetOptions(rainData);
});

const fetchData = (values) => {
  searchInfo.value.start_time = values[0];
  searchInfo.value.end_time = values[1];
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

// 计算属性，判断所有 options 的 series 是否为空
const isAllOptionsEmpty = computed(() =>
  allOptions.value.every((option) =>
    option.series.every((item) => !item.data || item.data.length === 0)
  )
);
</script>

<template>
  <div class="device-data">
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <el-empty v-if="isAllOptionsEmpty"></el-empty>
      <div v-else>
        <Chart :options="[rainOption]" />
        <div class="device-data__history">
          <Chart :options="allOptions" />
        </div>
      </div>

      <ElCard v-loading="loading" class="history-data-card">
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
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__history {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .history-data-card {
    margin-top: 24px;
  }
}
</style>
