<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Chart from "@/components/Chart/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/utils/chartData";
import rtuApi from "@/api/rtu";

const useRtuStore = useRtuStoreHook();
const route = useRoute();

const { id, type } = route.params;
const searchInfo = reactive({
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
    yAxisTitlePadding: [0, 0, 0, 10],
  })
); //雨量

const tempOption = reactive(
  getCommonLine({ seriesUnit: ["°C"], yAxisTitlePadding: [0, 0, 0, 10] })
); //温度

const windOption = reactive(
  getCommonLine({ seriesUnit: ["°"], yAxisTitlePadding: [0, 0, 0, 10] })
); //风向

const speedOption = reactive(
  getCommonLine({ seriesUnit: ["m/s"], yAxisTitlePadding: [0, 0, 0, 10] })
); //风速

const rainData = reactive({
  timeList: [],
  rain: [],
  duration: [],
  total_rain: [],
  temperature: [],
  wind: [],
  speed: [],
});
// 获取雨量图表数据
const getRainChartData = () => {
  const { page, limit, ...params } = searchInfo;
  rtuApi.getRainData(params).then((res) => {
    if (!res.code) {
      rainData.timeList = res.data.list[0].timeList;
      rainData.rain = res.data.list[0].valueList;
      rainData.duration = res.data.list[1].valueList;
      rainData.total_rain = res.data.list[2].valueList;
      rainData.temperature = res.data.list[3].valueList;
      rainData.wind = res.data.list[4].valueList;
      rainData.speed = res.data.list[5].valueList;
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
  // 雨量
  const colors = ["#ffd285", "#ff733f"];
  rainOption.legend.show = true;
  rainOption.legend.x = "center";
  rainOption.legend.data = ["降雨量", "累计降雨量", "降雨时长"];
  //   collectOption.color = colors;
  rainOption.xAxis[0].data = data.timeList;
  rainOption.yAxis[0].name = "{title|降雨量(mm)}";
  rainOption.yAxis[1].name = "{title|累计降雨量(mm)}";

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
  tempOption.legend.x = "center";
  tempOption.xAxis[0].data = data.timeList;
  tempOption.yAxis[0].name = "{title|温度(°C)}";

  tempOption.series[0] = {
    name: "温度",
    type: "line",
    data: data.rain,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };

  // 风向
  windOption.legend.x = "center";
  windOption.xAxis[0].data = data.timeList;
  windOption.yAxis[0].name = "{title|风向(°)}";

  windOption.series[0] = {
    name: "风向",
    type: "line",
    data: data.wind,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };

  // 风向
  speedOption.legend.x = "center";
  speedOption.xAxis[0].data = data.timeList;
  speedOption.yAxis[0].name = "{title|风速(m/s)}";

  speedOption.series[0] = {
    name: "风速",
    type: "line",
    data: data.speed,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
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
  rtuApi.getRainHistory(searchInfo).then((res) => {
    if (!res.code) {
      deviceData.total = res.data.total_count;
      deviceData.data = res.data.list.map((item, index) => ({
        ...item,
        num: index + 1,
      }));
    }
  });
};

// 切换分页
const handleChangePage = (page) => {
  searchInfo.page = page;
  getRainHistory();
};

// 切换条数
const handleChangeSize = (size) => {
  searchInfo.page = 1;
  searchInfo.limit = size;
  getRainHistory();
};

// 监听图表数据变化
watchEffect(() => {
  resetOptions(rainData);
});

useRtuStore.handleMethod((val) => {
  try {
    searchInfo.start_time = val[0];
    searchInfo.end_time = val[1];
    searchInfo.page = 1;
    getRainChartData();
    getRainHistory();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="device-data">
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <div class="device-data__history">
        <Chart
          :options="[rainOption, tempOption, windOption, speedOption]"
          :eleNames="['historyChart']"
        />
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
