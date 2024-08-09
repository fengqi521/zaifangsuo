<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import TimelineImage from "./TimelineImage.vue";
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

const mudLevelImages = reactive({ timeList: [], valueList: [] });
const searchInfo = ref({
  id,
  type,
  page: 1,
  limit: 10,
  start_time: "",
  end_time: "",
});

const collectOption = reactive(
  getCommonLine({ seriesUnit: ["m"], yAxisTitlePadding: [0, 0, 0, 10] })
);
// 图表
const chartData = reactive({ timeList: [], valueList: [] });

// 获取泥水位图表数据
const getMudChartData = () => {
  const { page, limit, ...params } = searchInfo.value;
  rtuApi.getRainData(params).then((res) => {
    if (!res.code) {
      Object.assign(chartData, res.data.list[0]);
      Object.assign(mudLevelImages, res.data.list[1]);
    }
  });
};

// 图表数据重组
const resetOptions = (data) => {
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.yAxis[0].name = "{title|泥水位(m)}";
  collectOption.series[0] = {
    name: "泥水位",
    type: "line",
    data: data.valueList,
    Symbol: "circle",
    // symbolSize: 6,
    smooth: true,
    unit: "m",
  };
};

// 监听数据变化
watchEffect(() => {
  resetOptions(chartData);
});

// 历史table数据
const loading = ref(false);
const deviceData = reactive({ total: 0, data: [] });
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "upload_time", label: "监测时间" },
  { prop: "data", label: "泥水位(m)" },
];
// 获取泥水位历史数据
const getMudLevelHistory = () => {
  const { page, limit } = searchInfo.value;
  rtuApi.getRainHistory(searchInfo.value).then((res) => {
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
  searchInfo.value.limit = size;
  getMudLevelHistory();
};

useRtuStore.handleMethod((val) => {
  try {
    searchInfo.value.start_time = val[0];
    searchInfo.value.end_time = val[1];
    searchInfo.value.page = 1;
    getMudChartData();
    getMudLevelHistory();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="device-data">
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <div class="device-data__history">
        <Chart :options="[collectOption]" />
        <TimelineImage :imagesData="mudLevelImages" />
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
