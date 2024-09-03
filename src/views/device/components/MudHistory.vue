<script setup>
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TimelineImage from "./TimelineImage.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import MudChart from "@/components/MudChart/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
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

// 获取泥水位图表数据
const chartLoading = ref(false);
const chartData = reactive({ timeList: [], valueList: [] });
const mudLevelImages = reactive({ timeList: [], valueList: [] });
const getMudChartData = () => {
  chartLoading.value = true;
  const { page, limit, ...params } = searchInfo.value;
  systemApi.getRainData(params).then((res) => {
    chartLoading.value = false;
    if (!res.code) {
      Object.assign(chartData, res.data.list[0]);
      Object.assign(mudLevelImages, res.data.list[1]);
    }
  });
};

// 历史table数据
const loading = ref(false);
const deviceData = reactive({ total: 0, data: [] });
const tableColumns = [
  { prop: "num", label: "序号", width: 80 },
  { prop: "upload_time", label: "监测时间" },
  { prop: "data", label: "泥水位(m)" },
];
// 获取泥水位历史数据
const getMudLevelHistory = () => {
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

// 切换分页
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getMudLevelHistory();
};

// 切换条数
const handleChangeSize = (size) => {
  searchInfo.value.page = 1;
  searchInfo.value.limit = size;
  getMudLevelHistory();
};

const fetchData = (values) => {
  searchInfo.value.start_time = values[0];
  searchInfo.value.end_time = values[1];
  Object.assign(chartData, { timeList: [], valueList: [] });
  Object.assign(mudLevelImages, { timeList: [], valueList: [] });
  Object.assign(deviceData, { data: [], total: 0 });
  getMudChartData();
  getMudLevelHistory();
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
      <ElCard title="泥水位监测数据">
        <MudChart :data="chartData" />
      </ElCard>
      <ElCard title="泥水位图像">
        <TimelineImage :imagesData="mudLevelImages" />
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
    grid-template-rows: 382px;
    gap: 16px;
  }

  .history-data-card {
    margin-top: 24px;
  }
}
</style>
