<script setup>
import { reactive, ref, watch } from "vue";
import MudLevelChart from "./MudLevelChart.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import { getStartAndEndTime } from "@/utils/index";

// 常量
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "monitortime", label: "监测时间" },
  { prop: "nswval", label: "泥水位(m)" },
];

const workColumns = [
  { prop: "num", label: "序号" },
  { prop: "monitortime", label: "监测时间" },
  { prop: "powerVolt", label: "电压(V)" },
  { prop: "temperature", label: "温度(℃)" },
];

const loading = ref(false);
const active = ref("day");
const dateTimeRange = ref([]);
const deviceData = reactive({
  page: 1,
  limit: 10,
  total: 0,
  data: [],
});

const wordData = reactive({
  page: 1,
  limit: 10,
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

// 获取工况数据
const getWorkHistory = (page, size) => {
  const res = {
    code: 0,
    status: true,
    msg: "",
    total: 136,
    size: 10,
    data: {
      records: [
        {
          powerVolt: 14.56,
          temperature: 34.3,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:20:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.02,
          temperature: 34.2,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:15:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.75,
          temperature: 33.9,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:10:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.16,
          temperature: 33.7,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:05:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.29,
          temperature: 33.4,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:00:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 13.93,
          temperature: 33.1,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:55:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.28,
          temperature: 32.8,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:50:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.04,
          temperature: 32.6,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:45:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 13.98,
          temperature: 32.4,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:40:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.35,
          temperature: 32.3,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:35:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
      ],

      orders: [],
      optimizeCountSql: true,
      searchCount: true,
      countId: null,
      maxLimit: null,
    },
    hasNext: false,
    hasPrevious: false,
  };
  if (!res.code) {
    wordData.total = res.total;
    Object.assign(
      wordData.data,
      res.data.records.map((item, index) => ({ ...item, num: index + 1 }))
    );
  }
};

// 更新时间获取数据
watch(
  active,
  (newVal) => {
    dateTimeRange.value = getStartAndEndTime(newVal);
    getMudLevelHistory();
    getWorkHistory();
  },
  { immediate: true }
);

console.log(deviceData);
</script>

<template>
  <div class="device-data">
    <ElCard title="设备工况" v-loading="loading">
      <MudLevelChart />
      <div class="device-data__history">
        <ElTable
          class="device-data__table"
          :loading="loading"
          :columns="workColumns"
          :data="wordData.data"
          :tableProps="{ showSelection: false, border: true }"
        />
        <ElPagination
          :currentPage="wordData.page"
          :page-size="wordData.limit"
          :total="wordData.total"
          @pagination-change="(page) => getMudLevelHistory(page)"
          @page-size-change="(size) => getMudLevelHistory(wordData.page, size)"
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

  &__actions {
    display: flex;
    align-items: center;

    .el-radio-group {
      margin-right: 12px;
    }
  }

  &__table {
    :deep(.el-scrollbar) {
      height: 408px;
    }
  }
}
</style>
