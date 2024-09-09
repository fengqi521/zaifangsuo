<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import BreakLineChart from "@/components/BreakLineChart/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";

import systemApi from "@/api";
const useRtuStore = useRtuStoreHook();
const route = useRoute();
const { id, type } = route.params;

// 图表
const searchInfo = ref({
  id,
  type,
  page: 1,
  limit: 10,
  start_time: "",
  end_time: "",
});

const chartData = reactive([]);
// 获取断线图表数据
const getBreakChartData = () => {
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getRainData(params).then((res) => {
    if (!res.code) {
      Object.assign(chartData, res.data.list);
    }
  });
};

// 历史table数据
const loading = ref(false);
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "state_name", label: "断线状态" },
];
const deviceData = reactive({
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

// 切换分页
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getBreakLevelHistory();
};

// 切换条数
const handleChangeSize = (size) => {
  searchInfo.value.page = 1;
  searchInfo.value.limit = size;
  getBreakLevelHistory();
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
    <ElCard title="断线监测数据" class="device-data__chart" v-loading="loading">
      <BreakLineChart :data="chartData" />
    </ElCard>
    <ElCard title="数据列表">
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
  &__chart {
    height: 382px;
    margin-bottom: 24px;
  }
}
</style>
