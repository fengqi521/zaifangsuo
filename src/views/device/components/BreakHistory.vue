<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
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
const collectOption = reactive(getCommonLine({ seriesUnit: [""] }));
// 图表
const searchInfo = ref({
  id,
  type,
  page: 1,
  limit: 10,
  start_time: "",
  end_time: "",
});

const chartData = reactive({ timeList: [], valueList: [] });
// 获取断线图表数据
const getBreakChartData = () => {
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getRainData(params).then((res) => {
    if (!res.code) {
      Object.assign(chartData, res.data.list[0]);
    }
  });
};
// 图表数据重组
const resetOptions = (data) => {
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.yAxis[0].name = "{title|1代表断开、0代表正常}";
  collectOption.yAxis[0].nameTextStyle.rich.title.padding = [0, 0, 0, 65];
  collectOption.series[0] = {
    name: "断线状态",
    type: "line",
    data: data.valueList,
    Symbol: "circle",
    // symbolSize: 6,
    smooth: true,
  };
};
watchEffect(() => {
  resetOptions(chartData);
});

// 历史table数据
const loading = ref(false);
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "state_name", label: "断线状态" },
];
const deviceData = reactive({
  page: 1,
  limit: 10,
  total: 0,
  data: [],
});

// 获取断线历史数据
const getBreakLevelHistory = () => {
  const { page, limit } = searchInfo.value;
  systemApi.getRainHistory(searchInfo.value).then((res) => {
    if (!res.code) {
      deviceData.total = res.data.total_count;
      deviceData.data = res.data.list.map((item, index) => ({
        ...item,
        state_name: item.line_state === 1 ? "断开" : "正常",
        num: (page - 1) * limit + index + 1,
      }));
    }
  });
};

const fetchData = (values) => {
  searchInfo.value.start_time = values[0];
  searchInfo.value.end_time = values[1];
  getBreakChartData();
  getBreakLevelHistory();
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
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <div class="device-data__history">
        <el-empty v-if="!chartData.timeList.length"></el-empty>
        <Chart :options="[collectOption]" v-else />
      </div>
      <div class="device-data__table">
        <ElTable
          :loading="loading"
          :columns="tableColumns"
          :data="deviceData.data"
          :tableProps="{ showSelection: false, border: true }"
        />
        <ElPagination
          :currentPage="deviceData.page"
          :page-size="deviceData.limit"
          :total="deviceData.total"
          @pagination-change="(page) => getBreakLevelHistory(page)"
          @page-size-change="
            (size) => getBreakLevelHistory(deviceData.page, size)
          "
        />
      </div>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__history {
    display: grid;
    // grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__table {
    margin-top: 24px;
    padding: 24px;
    border: 1px solid var(--card-border-color);
  }
}
</style>
