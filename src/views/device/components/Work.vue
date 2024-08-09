<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Chart from "@/components/Chart/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import rtuApi from "@/api/rtu";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/utils/chartData";

const route = useRoute();

const { id, type } = route.params;
const useRtuStore = useRtuStoreHook();
const collectOption = reactive(
  getCommonLine({ seriesUnit: ["V", "°C"], yAxisTitlePadding: [0, 0, 0, 10] })
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

const colors = ["#ffd285", "#ff733f"];
const chartData = reactive({ timeList: [], voltage: [], temperature: [] });
// 获取图表数据
const getWorkChartData = () => {
  const { page, limit, ...params } = searchInfo.value;
  rtuApi.getWorkData(params).then((res) => {
    if (!res.code) {
      chartData.timeList = res.data.list[0]?.timeList;
      chartData.voltage = res.data.list[0]?.valueList;
      chartData.temperature = res.data.list[1]?.valueList;
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
  collectOption.legend.show = true;
  collectOption.legend.x = "center";
  collectOption.legend.data = ["电压", "温度"];
  // collectOption.grid.top = 60
  collectOption.color = colors;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.yAxis[0].name = "{title|电压(V)}";
  collectOption.yAxis[1].name = "{title|温度(°C)}";

  collectOption.series[0] = {
    name: "电压",
    type: "line",
    data: data.voltage,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };
  collectOption.series[1] = {
    name: "温度",
    type: "line",
    data: data.temperature,
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
  const {page,limit} = searchInfo.value;
  rtuApi.getWorkHistory(searchInfo.value).then((res) => {
    if (!res.code) {
      workData.total = res.data.total_count;
      workData.data = res.data.list.map((item, index) => ({
        ...item,
        num:(page-1)*limit + index + 1,
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

useRtuStore.handleMethod((val) => {
  try {
    searchInfo.value.start_time = val[0];
    searchInfo.value.end_time = val[1];
    searchInfo.value.page = 1;
    getWorkChartData();
    getWorkHistory();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="device-data">
    <ElCard title="设备工况" v-loading="loading">
      <Chart :options="[collectOption]" :eleNames="['wordChart']" />
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
