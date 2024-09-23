<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Chart from "@/components/Chart/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import systemApi from "@/api";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/js/chartData";
import { getTopNum } from "@/utils";

const route = useRoute();

const { id, type } = route.params;
const useRtuStore = useRtuStoreHook();
const collectOption = reactive(
  getCommonLine({
    seriesUnit: ["V", "°C", "dBm"],
    yAxisTitlePadding: [0, 0, 0, 10],
  })
);

const searchInfo = ref({
  page: 1,
  limit: 10,
  type,
  id,
  start_time: "",
  end_time: "",
});
// 常量
const workColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "voltage", label: "电压(V)" },
  { prop: "temperature", label: "温度(°C)" },
];
// #7B3F00
const colors = ["#7B3F00", "#ff0000"];
const chartData = reactive({
  timeList: [],
  voltage: [],
  temperature: [],
  strength: [],
});
// 获取图表数据
const chartLoading = ref(false);
const getWorkChartData = () => {
  chartLoading.value = true;
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getWorkData(params).then((res) => {
    chartLoading.value = false;
    if (!res.code) {
      chartData.timeList = res.data.list[0]?.timeList;
      chartData.voltage = res.data.list[0]?.valueList;
      chartData.temperature = res.data.list[1]?.valueList;
      chartData.strength = res.data.list[2]?.valueList;
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
  const { timeList, voltage, temperature } = data;

  collectOption.legend.show = true;
  // collectOption.grid.right = 70;
  collectOption.legend = {
    ...collectOption.legend,
    x: "center",
    data: ["电压", "温度"],
    textStyle: {
      rich: {
        a: {
          verticalAlign: "middle",
        },
      },
      padding: [0, 0, -2, 0],
    },
  };

  collectOption.color = colors;
  collectOption.xAxis[0].data = timeList;

  const voltageMin = Math.min(...voltage);
  const voltageMax = Math.max(...voltage);
  const temperatureMin = Math.min(...temperature);
  const temperatureMax = Math.max(...temperature);
  collectOption.yAxis[0] = {
    ...collectOption.yAxis[0],
    name: "{title|电压(V)}",
    min: voltageMin,
    max: voltageMax,
  };

  collectOption.yAxis[1] = {
    ...collectOption.yAxis[1],
    name: "{title|温度(°C)}",
    min: temperatureMin,
    max: temperatureMax,
    splitLine: { show: false },
  };

  collectOption.series[0] = {
    name: "电压",
    type: "line",
    data: voltage,
    Symbol: "circle",
    smooth: true,
    position: "left",
  };
  collectOption.series[1] = {
    name: "温度",
    type: "line",
    data: temperature,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 1,
  };
};

watchEffect(() => {
  resetOptions(chartData);
});

const loading = ref(false);
const workData = reactive({
  total: 0,
  data: [],
});

// 获取工况历史数据
const getWorkHistory = () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  systemApi.getWorkHistory(searchInfo.value).then((res) => {
    loading.value = false;
    if (!res.code) {
      workData.total = res.data.total_count;
      workData.data = res.data.list.map((item, index) => ({
        ...item,
        num: (page - 1) * limit + index + 1,
      }));
    }
  });
};

// 切换页数
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getWorkHistory();
};

// 处理分页
const handleChangeLimit = (size) => {
  searchInfo.value.page = 1;
  searchInfo.value.limit = size;
  getWorkHistory();
};

const fetchData = (values) => {
  searchInfo.value.start_time = values[0];
  searchInfo.value.end_time = values[1];
  Object.assign(chartData, { timeList: [], voltage: [], temperature: [] });
  Object.assign(workData, { data: [], total: 0 });
  getWorkChartData();
  getWorkHistory();
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
  <div class="device-work">
    <ElCard title="设备工况数据" class="device-work__chart">
      <el-empty v-if="!chartData.timeList.length"></el-empty>
      <Chart :option="collectOption" v-else />
    </ElCard>
    <ElCard v-loading="loading" class="table-card" title="数据列表">
      <ElTable
        :loading="loading"
        :columns="workColumns"
        :data="workData.data"
        :tableProps="{ showSelection: false, border: true }"
      />
      <ElPagination
        :currentPage="searchInfo.page"
        :page-size="searchInfo.limit"
        :total="workData.total"
        @pagination-change="handleChangePage"
        @page-size-change="handleChangeLimit"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-work {
  &__chart {
    height: 382px;
    margin-bottom: 24px;
  }
}
</style>
