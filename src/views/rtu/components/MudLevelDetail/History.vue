<script setup>
import { reactive, ref, watch } from "vue";
import MudLevelImage from "./MudLevelImage.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";

// 图表数据
const collectOption = reactive(
  getCommonLine({ seriesUnit: "m", yAxisTitlePadding: [0, 0, 0, 10] })
);

// 历史table数据
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "monitortime", label: "监测时间" },
  { prop: "nswval", label: "泥水位(m)" },
];

const loading = ref(false);
const deviceData = reactive({
  page: 1,
  limit: 10,
  total: 0,
  data: [],
});

// 获取泥水位历史数据
const getMudLevelHistory = (page, size) => {
  if (page) deviceData.page = page;
  if (size) deviceData.limit = size;
  const tableRes = {
    code: 0,
    status: true,
    msg: "OK",
    pageNo: 1,
    pageSize: 10,
    total: 106,
    data: [
      {
        protocol: 3,
        monitortime: "2024-07-12 08:45:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:40:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:35:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:30:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:25:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:20:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:15:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:10:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:05:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:00:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:55:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:50:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:45:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:40:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:35:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:30:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:25:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:20:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:15:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:10:00",
        nswval: 2.909,
        variation: null,
      },
    ],
    hasNext: false,
    hasPrevious: false,
  };
  if (!tableRes.code) {
    deviceData.total = tableRes.total;
    Object.assign(
      deviceData.data,
      tableRes.data.map((item, index) => ({ ...item, num: index + 1 }))
    );
  }
};

// 图表数据重组
onMounted(() => {
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
});

defineExpose({getMudLevelHistory})
</script>

<template>
  <div class="device-data">
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <Chart :options="[collectOption]" />
      <div class="device-data__history">
        <div>
          <ElTable
            class="device-data__table"
            :loading="loading"
            :columns="tableColumns"
            :data="deviceData.data"
            :tableProps="{ showSelection: false, border: true }"
          />
          <ElPagination
            :currentPage="deviceData.page"
            :page-size="deviceData.limit"
            :total="deviceData.total"
            @pagination-change="(page) => getMudLevelHistory(page)"
            @page-size-change="
              (size) => getMudLevelHistory(deviceData.page, size)
            "
          />
        </div>
        <MudLevelImage />
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

  &__actions {
    display: flex;
    align-items: center;

    .el-radio-group {
      margin-right: 12px;
    }
  }

  &__history {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__table {
    border: 1px solid var(--normal-border-color);
    :deep(.el-scrollbar) {
      height: 408px;
    }
  }
}
</style>
