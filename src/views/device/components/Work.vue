<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Chart from "@/components/Chart/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import systemApi from "@/api";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/utils/chartData";
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
  { prop: "signal_strength", label: "信号强度(dBm)" },
];

const colors = ["#ff0000", "#ff733f", "#FFFF00"];
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
  const { timeList,voltage, temperature, strength } = data;
 
  collectOption.legend.show = true;
  collectOption.grid.right = 70;
  collectOption.legend = {
    ...collectOption.legend,
    x: "center",
    data: ["电压", "温度", "信号强度"],
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
  collectOption.xAxis[0].data = timeList


  const spliceNumber = 5
  const voltageMin = Math.min(...voltage);
  const voltageMax = Math.max(...voltage);
  const voltageInterval  = (voltageMax - voltageMin) / spliceNumber
  
  const temperatureMin = Math.min(...temperature);
  const temperatureMax = Math.max(...temperature);
  const temperatureInterval  = (temperatureMax - temperatureMin) / spliceNumber

  const strengthMin = Math.min(...strength);
  const strengthMax = Math.max(...strength)
  const strengthInterval  = (strengthMax - strengthMin) / spliceNumber
  console.log(strengthMax,strengthMin)
  collectOption.yAxis[0] = {
    ...collectOption.yAxis[0],
    name :"{title|电压(V)}",
    axisLabel: {
      formatter: (value) => value.toFixed(2),
    },
    min:voltageMin,
    interval:voltageInterval,
    max:voltageMax
  }



  collectOption.yAxis[1] = {
    ...collectOption.yAxis[1],
    name: "{title|温度(°C)}",
    axisLabel: {
      formatter: (value) => value.toFixed(2),
    },
    min:temperatureMin,
    max:temperatureMax,
    interval:temperatureInterval
  };

  collectOption.yAxis[2] = {
    ...collectOption.yAxis[1],
    name: "{title|信号强度(dBm)}",
    axisLabel: {
      formatter: (value) => value.toFixed(2),
    },
    offset: 100,
    min:strengthMin,
    max:strengthMax,
    interval:strengthInterval
  };

  collectOption.series[0] = {
    name: "电压",
    type: "line",
    data:voltage,
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
  collectOption.series[2] = {
    name: "信号强度",
    type: "line",
    data:strength,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 2,
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
  <div class="device-data">
    <ElCard title="设备工况">
      <div v-loading="chartLoading">
        <el-empty v-if="!chartData.timeList.length"></el-empty>
        <Chart :options="[collectOption]" v-else />
      </div>
      <ElCard v-loading="loading" class="history-data-card">
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
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  .history-data-card {
    margin-top: 24px;
  }
}
</style>
